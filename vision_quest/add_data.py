import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vision_quest.settings")
django.setup()
from vq_app.models import Jobs, ObjectResult, ProductResult, Media  # Replace 'myapp' with the actual name of your app
from django.contrib.auth.models import User

# new_user = User.objects.create_user(
#     username='test1',
#     first_name='John',
#     last_name='Doe',
#     email='john.doe@example.com',
#     password='securepassword'
# )

# Save the user record to the database
# new_user.save()

# # # Create a new instance of Jobs
# job = Jobs(
#     user_id=1,  # Replace with the actual user ID
#     options={"algorithm": "YOLOv5", "objects": "chair, cup, computer", "threshold":20},  # Example options data

# )

# # Save the instance to the database
# job.save()


#Object Result
# new_object_result = ObjectResult(
#     job_id=2,  # Replace with the actual run_id
#     object_class='cup',
#     confidence_score=0.90,
#     remarks='Detected a chair in the image'
# )
# new_object_result.save()



# new_product_result = ProductResult(
#     job_id=2,  # Replace with the actual run_id
#     product_name='cups',
#     confidence_score=0.92,
#     brand_name='Ikea',
#     price=149.99,
#     link='https://www.example.com/ikea/product123'
# )

# # Save the instance to the database
# new_product_result.save()

new_media = Media(
    job_id=2,  # Replace with the actual run_id
    image_path='path/to/image.jpg',
    image_size='78 Kb',
    image_name='image123.jpg'
)

new_media.save()