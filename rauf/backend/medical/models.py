from django.db import models
from consultations.models import Consultation
from django.utils import timezone


class MedicalRecord(models.Model):
    consultation = models.OneToOneField(
        Consultation,
        on_delete=models.CASCADE,
        related_name="medical_record"
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)


class Diagnosis(models.Model):
    record = models.ForeignKey(
        MedicalRecord,
        on_delete=models.CASCADE,
        related_name="diagnoses"
    )

    description = models.TextField()

    created_at = models.DateTimeField(default=timezone.now, editable=False)


class Prescription(models.Model):
    record = models.ForeignKey(
        MedicalRecord,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    medication = models.CharField(
        max_length=255, default="Unknown medication")

    dosage = models.CharField(
        max_length=255, default="Not specified", null=True)

    instructions = models.TextField(
        default="No instructions provided", null=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
