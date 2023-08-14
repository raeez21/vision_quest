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
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer
from .models import Media, Jobs, ObjectResult
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
from .utils import get_related, invoke_model
from datetime import datetime
# Add the root directory of the project to the Python path
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))

# def members(request):
#     return HttpResponse("Hello world!")


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
        return Response({'token': token.key}, status=status.HTTP_200_OK)
        # return Response(data, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)





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
            model = request.data.get('model')
            dataset = request.data.get('dataset')
            objects_str = request.data.get('objects', [])  # Get list of objects
            objects = objects_str.split(',') if objects_str else []
            confThreshold = float(request.data.get('confThreshold', 0.5))  # Get confThreshold
            nmsThreshold = float(request.data.get('nmsThreshold', 0.5))
            options = {'model':model,'dataset':dataset,'objects': objects, 'ConfidenceThreshold': confThreshold, 'NmsThreshold': nmsThreshold}

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

    result_list = []
    for media_entry in media_entries:
        formatted_timestamp = media_entry.job.timestamp.strftime('%d-%m-%Y')
        result_list.append({
            "image_name": media_entry.image_name,
            "output_image_path": media_entry.output_image_path,
            "timestamp": formatted_timestamp
        })
    print("result LISt:",result_list)
    return JsonResponse(result_list, safe=False)

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
        



