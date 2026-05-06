from django.db import models


from django.db import models
from django.conf import settings
from pets.models import Pet

# Create your models here.


class Consultation(models.Model):

    """
    هذا يمثل جلسة بين Pet Owner و Vet
    """

    STATUS_CHOICES = (
        ("booked", "Booked"),
        ("cancelled", "Cancelled"),
        ("started", "Started"),
        ("ended", "Ended"),
    )

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pet_consultations"
    )

    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vet_consultations"
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="booked")

    scheduled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consultation {self.id}"
