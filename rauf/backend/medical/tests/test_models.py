from django.test import TestCase
from consultations.models import Consultation
from accounts.models import User
from pets.models import Pet
from medical.models import MedicalRecord, Diagnosis, Prescription

class MedicalModelsTests(TestCase):
    def setUp(self):
        
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password", role="pet_owner")
        self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
        self.consultation = Consultation.objects.create(pet=self.pet, owner=self.owner, vet=self.vet)
        
        
        self.record = MedicalRecord.objects.create(consultation=self.consultation, notes="فحص روتيني")

    def test_medical_record_creation(self):
        self.assertEqual(self.record.consultation, self.consultation)
        self.assertEqual(self.record.notes, "فحص روتيني")

    def test_diagnosis_creation(self):
        diagnosis = Diagnosis.objects.create(record=self.record, description="حساسية طفيفة")
        self.assertEqual(diagnosis.record, self.record)
        self.assertEqual(self.record.diagnoses.count(), 1)

    def test_prescription_creation_defaults(self):
        prescription = Prescription.objects.create(record=self.record)
        self.assertEqual(prescription.medication, "Unknown medication")
        self.assertEqual(prescription.dosage, "Not specified")
        self.assertEqual(prescription.instructions, "No instructions provided")

    def test_cascade_delete(self):
        Diagnosis.objects.create(record=self.record, description="فحص")
        Prescription.objects.create(record=self.record, medication="دواء")
        
        self.record.delete()
        
        self.assertEqual(Diagnosis.objects.count(), 0)
        self.assertEqual(Prescription.objects.count(), 0)