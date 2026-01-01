from django.db import models

# Create your models here.
class Project(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    start_date=models.DateField()
    end_date=models.DateField(null=True,
                              blank=True)
    created_by=models.ForeignKey("auth_master.User",
                                 on_delete=models.CASCADE,
                                 related_name="projects")

    team=models.ForeignKey("teams.teams",
                           on_delete=models.CASCADE,
                           related_name="projects",
                           null=True,
                           blank=True)
    
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    