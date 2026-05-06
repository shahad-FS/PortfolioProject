from django.db import models
from consultations.models import Consultation

# Create your models here.
class VideoSession(models.Model):

    consultation = models.OneToOneField(
        Consultation,
        on_delete=models.CASCADE
    )

    session_id = models.CharField(max_length=255, unique=True)

    join_url = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("created", "Created"),
            ("started", "Started"),
            ("ended", "Ended")
        ],
        default="created"
    )

    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)