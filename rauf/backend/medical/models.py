from django.db import models
from consultations.models import Consultation
from pets.models import Pet

# Create your models here.

class MedicalRecord(models.Model):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)


class Diagnosis(models.Model):
    record = models.OneToOneField(MedicalRecord, on_delete=models.CASCADE)
    description = models.TextField()


class Prescription(models.Model):
    record = models.OneToOneField(MedicalRecord, on_delete=models.CASCADE)
    medications = models.TextField()