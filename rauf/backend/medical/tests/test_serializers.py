from django.test import TestCase
from medical.serializers import MedicalRecordSerializer
from consultations.models import Consultation
from accounts.models import User
from pets.models import Pet
from medical.models import MedicalRecord

class MedicalRecordSerializerTests(TestCase):
    def setUp(self):
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password", role="pet_owner")
        self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
        self.consultation = Consultation.objects.create(pet=self.pet, owner=self.owner, vet=self.vet)

    def test_serializer_valid_data(self):
        data = {
            "consultation_id": self.consultation.id,
            "notes": "المريض يعاني من خمول طفيف."
        }
        serializer = MedicalRecordSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        record = serializer.save()
        self.assertEqual(record.consultation, self.consultation)
        self.assertEqual(record.notes, "المريض يعاني من خمول طفيف.")

    def test_serializer_read_only_fields(self):
        data = {
            "consultation_id": self.consultation.id,
            "id": 999,
            "created_at": "2020-01-01T10:00:00Z"
        }
        serializer = MedicalRecordSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        record = serializer.save()
        
        self.assertNotEqual(record.id, 999)
        self.assertNotEqual(str(record.created_at), "2020-01-01T10:00:00Z")

    def test_serializer_missing_consultation_id(self):
        data = {"notes": "بيانات ناقصة"}
        serializer = MedicalRecordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("consultation_id", serializer.errors)