import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vision_quest.settings")
django.setup()
from models import Jobs  # Replace 'myapp' with the actual name of your app

# Create a new instance of Jobs
job = Jobs(
    user_id=1,  # Replace with the actual user ID
    options={"algorithm": "YOLOv5", "objects": "chair, cup, computer", "threshold":20},  # Example options data

)

# Save the instance to the database
job.save()