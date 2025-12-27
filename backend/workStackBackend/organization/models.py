from django.db import models

# Create your models here.
class organization(models.Model):
    name=models.CharField(max_length=100)
    address=models.CharField(max_length=200)
    email=models.EmailField(unique=True)
    phone=models.CharField(max_length=15)
    created_at=models.DateTimeField(auto_now_add=True)
    