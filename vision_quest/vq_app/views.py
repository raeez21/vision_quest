from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
#from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, ProfileSerializer
from .models import Media, Jobs, ObjectResult, ProductResult, RelatedProducts
import sys
import os
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View
from django.core.files.storage import default_storage
from django.conf import settings
# import datetime
from .utils import get_related, invoke_model, usage_analytics, get_url_path
from datetime import datetime
from rest_framework import generics
import json

# Add the root directory of the project to the Python path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))

# def members(request):
#     return HttpResponse("Hello world!")

server_address = "http://127.0.0.1:8000"


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        # refresh = RefreshToken.for_user(user)
        # data = {
        #     'refresh': str(refresh),
        #     'access': str(refresh.access_token),
        # }
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key,'username':username}, status=status.HTTP_200_OK)
        # return Response(data, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    user = request.user
    Token.objects.filter(user=user).delete()
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
# @login_required
# @permission_classes([IsAuthenticated])
def analyze(request):
    image_file = request.FILES.get('image')
    if request.data.get('type') == 'image':
        if image_file:
            user_name = request.user.username
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            taskType = request.data.get("taskType")
            doRelated = request.data.get("doRelated")
            if taskType == "object":
                model = request.data.get('model')
                dataset = request.data.get('dataset')
                objects_str = request.data.get('objects', [])  # Get list of objects
                objects = objects_str.split(',') if objects_str else []
                confThreshold_str = request.data.get('confThreshold')  # Get confThreshold
                confThreshold = float(confThreshold_str) if confThreshold_str else 0.5
                nmsThreshold_str = request.data.get('nmsThreshold')
                nmsThreshold = float(nmsThreshold_str) if nmsThreshold_str else 0.5
                options = {'taskType':taskType, 'model':model, 'dataset':dataset, 'objects': objects, 'ConfidenceThreshold': confThreshold, \
                      'NmsThreshold': nmsThreshold, "doRelated":doRelated}

            elif taskType == "product":

                confThreshold_str = request.data.get('confThreshold')
                confThreshold = float(confThreshold_str) if confThreshold_str else 0.5
                nmsThreshold_str = request.data.get('nmsThreshold')
                nmsThreshold = float(nmsThreshold_str) if nmsThreshold_str else 0.5
                options = {'taskType':taskType, 'ConfidenceThreshold': confThreshold, 'NmsThreshold': nmsThreshold, "doRelated":doRelated}

            #Save Media Model
            media = Media()
            media.job = Jobs.objects.create(user=request.user, options=options, timestamp=timezone.now())
            media.image_name = image_file.name
            media.input_image_path = os.path.join(settings.MEDIA_ROOT,'input',f"{user_name}_{timestamp}_{image_file.name}")
            
            image_input_path =  media.input_image_path  #os.path.join(settings.MEDIA_ROOT, media.image_path)
            image_output_path = os.path.join(settings.MEDIA_ROOT,'output',os.path.basename(image_input_path))
            
            media.output_image_path = image_output_path
            media.image_size = f"{image_file.size / 1024:.2f} KB"
            media.save()

            #Save the incoming image into CDN
            # image_input_path =  media.image_path  #os.path.join(settings.MEDIA_ROOT, media.image_path)
            # image_output_path = os.path.join(settings.MEDIA_ROOT,'output',os.path.basename(image_input_path))
            with open(image_input_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)

            #Call the Model based on input data
            response_data = invoke_model(media.job, image_input_path, image_output_path, options)
        
            return JsonResponse(response_data)

        return JsonResponse({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'Video coming soon'})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    media_entries = Media.objects.filter(job__user=user).order_by('-job__timestamp')

    jobs_list = []
    for media_entry in media_entries:

        output_url_path = get_url_path(media_entry.output_image_path)

        formatted_timestamp = media_entry.job.timestamp.strftime('%d-%m-%Y')
        
        jobs_list.append({
            " job_id": media_entry.job.job_id,
            "image_name": media_entry.image_name,
            "output_image_path": output_url_path,
            "timestamp": formatted_timestamp,
        })
    analytics_data = usage_analytics(user)
    result_dict = {
        "jobs": jobs_list,
        "analytics": {
            "graph_data": analytics_data["graph_data"],
            "jobs_performed": analytics_data["jobs_performed"],
            "average_daily_jobs": analytics_data["average_daily_jobs"],
            "max_jobs_in_day": analytics_data["max_jobs_in_day"]
        }
    }
    json_data = json.dumps(result_dict, ensure_ascii=False)
    print(json_data)
    return JsonResponse(result_dict, json_dumps_params={'ensure_ascii': False})
    return JsonResponse(json_data, safe=False, content_type='application/json')
    result_list.append(analytics_data)
    print("result LISt:",result_list)
    return JsonResponse(result_list, safe=False)
    result_list = []
    # for media_entry in media_entries:
    #     formatted_timestamp = media_entry.job.timestamp.strftime('%d-%m-%Y')
    #     result_list.append({
    #         "job_id": media_entry.job.job_id,
    #         "image_name": media_entry.image_name,
    #         "output_image_path": media_entry.output_image_path,
    #         "timestamp": formatted_timestamp,
    #     })
    # analytics_data = usage_analytics(user)
    # result_list.append(analytics_data)
    # # Convert the list of dictionaries to a single dictionary
    # result_dict = {}
    # for item in result_list:
    #     result_dict.update(item)
    #  # Convert the dictionary to JSON
    # # json_data = json.dumps(result_dict)
    
    # # return JsonResponse(json_data, safe=False, content_type='application/json')
    # return JsonResponse(result_dict, json_dumps_params={'ensure_ascii': False})
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def results(request):
    user = request.user
    job_id = request.GET.get('job_id') # Handle the case when specific job_id is provided in query parameters
    if job_id:
        try:
            job = Jobs.objects.get(pk=job_id, user=user)
        except Jobs.DoesNotExist:
            return HttpResponseBadRequest("Job not found for the current user.")
        
        task_type = job.options.get("taskType")
        if task_type == "object":
            object_results = ObjectResult.objects.filter(job=job)
            pred_result = [{"object_class": obj.object_class, "confidence_score": obj.confidence_score, "remarks": obj.remarks, "bbox": obj.bbox} for obj in object_results]
        elif task_type == "product":
            product_results = ProductResult.objects.filter(job=job)
            pred_result = [{"product_name": prod.product_name, "confidence_score": prod.confidence_score, "link": prod.link} for prod in product_results]
        media = Media.objects.get(job=job)
        
        # relative_path = os.path.relpath(media.output_image_path, settings.MEDIA_ROOT)
        # url_path = urljoin(settings.MEDIA_URL, relative_path.replace("\\", "/"))
        # url_path = urljoin(server_address, url_path.lstrip("/"))
        url_path = get_url_path(media.output_image_path)
        related_results = RelatedProducts.objects.filter(job=job)
        related_results_list = []
        for related_result in related_results:
            related_results_list.append({
                "title": related_result.title,
                "link": related_result.link,
                "image_link": related_result.image_link
            })
        result_data = {
            "job_id": job.job_id,
            "options": job.options,
            "prediction_results": pred_result,
            "media": {
                "output_image_path": url_path,#media.output_image_path,
                "image_size": media.image_size,
                "image_name": media.image_name,
            },
            "related_results": related_results_list
        }
    else:
        jobs = Jobs.objects.filter(user=user)
        result_data = [{
            "job_id": job.job_id,
            "image_name": job.media_set.first().image_name,
            "timestamp": job.timestamp
        } for job in jobs]
    print("results data:",result_data)
    return JsonResponse(result_data, safe=False)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = ProfileSerializer(user)
    return Response(serializer.data)

# class AnalyzeView(LoginRequiredMixin, View):
#     def post(self, request):
#         image_file = request.FILES.get('image')
#         job_id = request.data.get('job')
#         print("typee",type(image_file))
#         print("req:",request)
#         if image_file:
#             job = Jobs.objects.create(user=request.user, options={}, timestamp=timezone.now())

#             media = Media()
#             media.job = job
#             media.save()
#             image_path = default_storage.url(media.image.name)
#             print("in here image_path:",image_path)
#             detect1(image_path)
#             response_data = {
#                     'message': 'Image analysis complete.',
#                     'result': 'Your analysis result here',  # Replace with your actual result
#                 }
#             return JsonResponse(response_data)

#         return JsonResponse({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        



