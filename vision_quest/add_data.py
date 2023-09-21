#Dev script to add data manually to the DB.....not used anymore

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vision_quest.settings")
django.setup()
from vq_app.models import Jobs, ObjectResult, ProductResult, Media  
from django.contrib.auth.models import User



new_media = Media(
    job_id=2,  # Replace with the actual run_id
    image_path='path/to/image.jpg',
    image_size='78 Kb',
    image_name='image123.jpg'
)

new_media.save()