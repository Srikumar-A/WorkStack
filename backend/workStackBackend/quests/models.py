from django.db import models

# Create your models here.
class Quest(models.Model):
    title=models.CharField(max_length=200)
    description=models.TextField(blank=True)

    STATUS=(
        ("pending","Pending"),
        ("in_progress","In_Progress"),
        ("completed","Completed"),
    )
    project=models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="quests"
    )
    team=models.ForeignKey(
        "teams.teams",
        on_delete=models.CASCADE,
        related_name="quests",
        null=True,
        blank=True
    )
    organization=models.ForeignKey(
        "organization.organization",
        on_delete=models.CASCADE,
        related_name="quests",
        null=True,
        blank=True
    )
    assigned_to=models.ForeignKey(
        "auth_master.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_quests"
    )
    created_by=models.ForeignKey(
        "auth_master.User",
        on_delete=models.CASCADE,
        related_name="created_quests"
    )
    status=models.CharField(max_length=20, choices=STATUS, default="pending")
    created_at=models.DateTimeField(auto_now_add=True)
    deadline=models.DateField(null=True, blank=True)
    updated_at=models.DateTimeField(auto_now=True)
    start_date=models.DateField(auto_now=True)

    def __str__(self):
        return self.title
    class Meta:
        indexes=[
            models.Index(fields=['team','status']),
            models.Index(fields=['assigned_to']),
        ]