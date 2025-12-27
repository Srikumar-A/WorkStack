from django.db import models

# Create your models here.
class teams(models.Model):
    team_name=models.CharField(max_length=100)
    organization=models.ForeignKey('organization.organization', 
                                   on_delete=models.CASCADE,
                                   related_name='teams')
    created_at=models.DateTimeField(auto_now_add=True)
    

class team_members(models.Model):
    Roles=(
        ("lead","Lead"),
        ("member","Member"),
    )
    user=models.ForeignKey('auth_master.User', 
                           on_delete=models.CASCADE,
                            related_name='team_memberships')
    team=models.ForeignKey('teams.teams', 
                           on_delete=models.CASCADE,
                            related_name='members')
    role=models.CharField(max_length=10, choices=Roles,default="member")
    joined_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'team')