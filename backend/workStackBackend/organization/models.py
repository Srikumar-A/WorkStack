from django.db import models

# Create your models here.
class organization(models.Model):
    name=models.CharField(max_length=100)
    address=models.CharField(max_length=200)
    email=models.EmailField(unique=True)
    phone=models.CharField(max_length=15)
    created_at=models.DateTimeField(auto_now_add=True)
    
# added model for membership grant, will focus on it later
class organizationMembership(models.Model):
    role=(
        ("admin","Admin"),
        ("lead","Lead"),
        ("manager","Manager"),
        ("member","Member")
    )
    user=models.ForeignKey("auth_master.User",
                           on_delete=models.CASCADE,
                           related_name="organization_membership")
    organization=models.ForeignKey(organization,
                                   on_delete=models.CASCADE,
                                   related_name="organization_membership")
    access=(
        ("granted","Granted"),
        ("denied","Denied")
    )
    requested_at=models.DateTimeField(auto_now_add=True)
    approved_at=models.DateTimeField(null=True,blank=True)

    class Meta:
        unique_together=("user","organization")

    def __str__(self):
        return f"{self.user}->{self.organization}--{self.access}"