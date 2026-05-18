import uuid
from django.db import models
from consultations.models import Consultation


class VideoSession(models.Model):

    consultation = models.OneToOneField(
        Consultation,
        on_delete=models.CASCADE
    )

    session_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False)

    join_url = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("waiting", "Waiting"),
            ("started", "Started"),
            ("ended", "Ended"),
        ],
        default="waiting"
    )

    started_at = models.DateTimeField(null=True, blank=True)

    ended_at = models.DateTimeField(null=True, blank=True)

    offer = models.JSONField(null=True, blank=True)

    answer = models.JSONField(null=True, blank=True)

    ice_candidates = models.JSONField(default=list, blank=True)

    vet_joined = models.BooleanField(default=False)

    owner_joined = models.BooleanField(default=False)

    def __str__(self):
        return f"VideoSession for Consultation {self.consultation.id}"
