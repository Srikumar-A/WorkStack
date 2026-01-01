from django.db import models
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AbstractUser
from teams.models import teams

# Create your models here.

@receiver(post_save,sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender,instance=None,created=False,**kwargs):
    if created:
        Token.objects.create(user=instance)


class User(AbstractUser):
    organization = models.ForeignKey('organization.organization', 
                                     on_delete=models.CASCADE, 
                                     null=True, 
                                     blank=True, 
                                     related_name='users')
    teams=models.ManyToManyField(
        teams,
        through='teams.team_members',
        related_name='users'

    )
    
    def __str__(self):
        return self.username