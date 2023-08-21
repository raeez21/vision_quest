
from serpapi import GoogleSearch
from .models import ObjectResult, RelatedProducts
# import sys
# sys.path.insert(0, 'models/yolov7_coco')
from ml_models.ssd_coco import ssd_coco
from ml_models.yolov7_coco import yolov7_coco
from ml_models.frcnn_voc import frcnn_voc
from .change_cwd_context import change_cwd
import os

PERFORM_RELATED = False
api_key = "66678e1ad49d4ce51eadc41af1aea56d15f7d078807042cc51ac798f8dd60508"

def image_search(obj_name):
    params = {

        "api_key": "66678e1ad49d4ce51eadc41af1aea56d15f7d078807042cc51ac798f8dd60508",
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



def invoke_model(job, image_input_path, image_output_path, options):

    print("Invoking the model with options:",options)
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
        for obj_name in unique_classes:
            if obj_name != 'person' and PERFORM_RELATED:
                related_results = get_related(obj_name, job)
                full_related_results.append(related_results)
        # print("full related:",full_related_results)
    print("respone:",response_data)
    return response_data