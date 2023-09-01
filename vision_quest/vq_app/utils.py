
from serpapi import GoogleSearch
from .models import ObjectResult, RelatedProducts, Jobs, ProductResult
# import sys
# sys.path.insert(0, 'models/yolov7_coco')
from ml_models.ssd_coco import ssd_coco
from ml_models.yolov7_coco import yolov7_coco
from ml_models.frcnn_voc import frcnn_voc
from .change_cwd_context import change_cwd
import os
from django.db.models import Count, Avg, Max, Sum
from django.db.models.functions import TruncDate
from datetime import timedelta
from django.db.models import F, IntegerField
from django.db.models.functions import Coalesce, Cast
from urllib.parse import urljoin
from roboflow import Roboflow
from django.conf import settings

PERFORM_RELATED = True
api_key = "bbc2961b414bf10ab233c7c80919fa0aefa5cbbb1b00fcd3e185aaf857697ad4"

rf = Roboflow(api_key="hsi4SvXlQx8ixdpbFSYW")
project = rf.workspace().project("nike-shoe-detector-j1bln")
rf_model = project.version(1).model


link_dict = {"Nike Alphafly":"https://www.nike.com/gb/running/alphafly",
             "Nike Lebron 09": "https://www.nike.com/gb/t/lebron-9-low-shoes-7dfd7R",
             "Nike Air Force": "https://www.nike.com/gb/w/air-force-1-shoes-5sj3yzy7ok",
             "Nike Air Max": "https://www.nike.com/gb/w/air-max-shoes-a6d8hzy7ok"
             }


def get_url_path(path):
    server_address = "http://127.0.0.1:8000"
    relative_path = os.path.relpath(path, settings.MEDIA_ROOT)
    url_path = urljoin(settings.MEDIA_URL, relative_path.replace("\\", "/"))
    url_path = urljoin(server_address, url_path.lstrip("/"))
    return url_path


def image_search(obj_name):
    params = {

        "api_key": api_key,
        "engine": "google_images",
        "google_domain": "google.co.uk",
        "q": obj_name,
        "hl": "en",
        "gl": "uk",
        "location": "United Kingdom"
    }
    search = GoogleSearch(params)
    image_results = search.get_dict()["images_results"]
    first_10_image_results = image_results[:10] if len(image_results) >= 10 else image_results
    for result in first_10_image_results:
        if "related_content_id" in result:
            return result["related_content_id"]
    return None


def get_related(obj_name, job):
    print("obj_name,",obj_name)
    related_content_id = image_search(obj_name)
    if related_content_id:
        print("realted_id",related_content_id)
        params = {
            "api_key": api_key,
            "engine": "google_images_related_content",
            "hl": "en",
            "gl": "uk",
            "related_content_id": related_content_id
        }
        search = GoogleSearch(params)
        related_results = search.get_dict()["related_content"]
        first_5_related_results = related_results[:5] if len(related_results) >= 5 else related_results
        selected_fields = [{"title": item["title"], "link": item["link"], "image_link": item["original"]} for item in first_5_related_results]
        for item in selected_fields:
            RelatedProducts.objects.create(
                job=job,
                title=item["title"],
                link=item["link"],
                image_link=item["image_link"]
            )
        return selected_fields


def product_det(image_input_path, image_output_path, confThresh, nmsThresh):
    prediction = rf_model.predict(image_input_path, confidence=confThresh, overlap=nmsThresh)#.save("prediction.jpg"))
    
    prodInfo = []
    for pred in prediction.json()["predictions"]:
        prodInfo.append([pred["class"], round(pred["confidence"]*100,2), link_dict[pred["class"]]])
    # product_name = pred.json()["predictions"][0]["class"]
    # confidence_score = pred.json()["predictions"][0]["confidence"]
    # link = link_dict[product_name]
    prediction.save(image_output_path)
    return prodInfo

def invoke_model(job, image_input_path, image_output_path, options):

    print("Invoking the model with options:",options)
    PERFORM_RELATED = True if options["doRelated"]=='true' else False
    print("perddd",PERFORM_RELATED)
    if options['taskType'] == 'object':
        if options['model']=='ssd' and options['dataset'] == 'coco':
            objectInfo = ssd_coco.detect(image_input_path, image_output_path, options['ConfidenceThreshold'], options['NmsThreshold'], options['objects'])
        elif options['model']=='yolov7' and options['dataset'] == 'coco':
            with change_cwd(os.path.join(os.getcwd(), "ml_models\yolov7_coco")):
                objectInfo = yolov7_coco.detect(image_input_path, image_output_path, options['ConfidenceThreshold'], options['NmsThreshold'], options['objects'])
        elif options['model'] == 'f_rcnn' and options['dataset'] == 'voc':
            objectInfo = frcnn_voc.detect(image_input_path, image_output_path, options['ConfidenceThreshold'], options['NmsThreshold'], options['objects'])
        print("object Info:",objectInfo)
        objectInfo_serializable = [[bbox.tolist(), label, conf] for bbox, label,conf in objectInfo]
        response_data = {
                'message': 'Image analysis complete.',
                'job_id':job.job_id,
                'result': objectInfo_serializable,  
            }
        full_related_results = []
        unique_classes = set()
        if not objectInfo:
            # No objects detected, add a row with remarks
            object_result = ObjectResult(
                        job=job,
                        bbox=[0, 0, 0, 0],  # Default bbox values
                        object_class='No objects detected',
                        confidence_score=0.0,
                        remarks='No objects detected with the existing options',
                    )
            object_result.save()
        else:
            for obj_info in objectInfo:
                print("type of bbkox 0",type(obj_info[0]))
                object_result = ObjectResult(
                            job = job,
                            bbox = obj_info[0].tolist(),
                            object_class = obj_info[1],
                            confidence_score = float(obj_info[2]),
                            remarks = "",
                        )
                object_result.save()
                unique_classes.add(obj_info[1])
            
            total_desired_images = 10
            images_per_obj_name = total_desired_images // len(unique_classes)
            for obj_name in unique_classes:
                if obj_name != 'person' and PERFORM_RELATED:
                    related_results = get_related(obj_name, job)
                    related_results = related_results[:images_per_obj_name]
                    full_related_results.extend(related_results)
        response_data["related_results"] = full_related_results
        print("full related:",full_related_results)
        print("respone:",response_data)

    if options['taskType'] == 'product':
        unique_classes = set()
        full_related_results = []
        prodInfo = product_det(image_input_path, image_output_path, options['ConfidenceThreshold'], options['NmsThreshold'])
        response_data = {
                'message': 'Image analysis complete.',
                'job_id':job.job_id,
                'result': prodInfo,  
            }
        if not prodInfo:
            prodResult = ProductResult(
                        job=job,
                        product_name=None,  # Default bbox values
                        confidence_score=0.0,
                        link="Null",
                        remarks='No objects detected with current settings. Try changing the settings',
                    )
            prodResult.save()
        else:
            for prod in prodInfo:
                prodResult = ProductResult(
                        job=job,
                        product_name=prod[0],  # Default bbox values
                        confidence_score=prod[1],
                        link=prod[2],
                        remarks=' ',
                    )
                prodResult.save()
                unique_classes.add(prod[0])
            
            total_desired_images = 10
            images_per_obj_name = total_desired_images // len(unique_classes)
            for obj_name in unique_classes:
                if obj_name != 'person' and PERFORM_RELATED:
                    related_results = get_related(obj_name, job)
                    related_results = related_results[:images_per_obj_name]
                    full_related_results.extend(related_results)
        response_data["related_results"] = full_related_results
    return response_data


def usage_analytics(user):
    jobs_daily_count = Jobs.objects.filter(user=user).annotate(date=TruncDate('timestamp')).values('date').annotate(count=Count('job_id')).order_by('date')
    graph_data = []
    for entry in jobs_daily_count:
        formatted_date = entry['date'].strftime('%d-%m-%Y')
        graph_data.append({"date":formatted_date, "count":entry['count']})

    # Get usage analytics data
    jobs_performed = Jobs.objects.filter(user=user).count()
    average_daily_jobs = Jobs.objects.filter(user=user).annotate(date=TruncDate('timestamp')).values('date').annotate(count=Count('job_id')).aggregate(avg_count=Coalesce(Cast(Avg('count'), output_field=IntegerField()) , 0))['avg_count']
    max_jobs_in_day = Jobs.objects.filter(user=user).annotate(date=TruncDate('timestamp')).values('date').annotate(count=Count('job_id')).aggregate(max_count=Coalesce(Cast(Max('count'), output_field=IntegerField()), 0))['max_count']

    # Prepare the usage analytics response
    analytics_data = {
        "graph_data": graph_data,
        "jobs_performed": jobs_performed,
        "average_daily_jobs": average_daily_jobs,
        "max_jobs_in_day": max_jobs_in_day,
    }
    return analytics_data