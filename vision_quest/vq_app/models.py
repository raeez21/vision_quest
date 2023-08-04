from django.db import models
from django.contrib.auth.models import User


class Jobs(models.Model):
    job_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    options = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = "Jobs"


class ObjectResult(models.Model):
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    object_class = models.CharField(max_length=255)
    confidence_score = models.FloatField()
    remarks = models.TextField()
    class Meta:
        db_table = "ObjectResult"

class ProductResult(models.Model):
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    confidence_score = models.FloatField()
    brand_name = models.CharField(max_length=255)
    price = models.FloatField()
    link = models.URLField()
    class Meta:
        db_table = "ProductResult"


class Media(models.Model):
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    image_path = models.CharField(max_length=255)
    image_size = models.CharField(max_length=255)
    image_name = models.CharField(max_length=255)
    class Meta:
        db_table = "Media"