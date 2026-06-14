from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from pets.models import Pet
from consultations.models import Consultation
from medical.models import MedicalRecord

class MedicalViewsTests(APITestCase):
    def setUp(self):
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.other_vet = User.objects.create_user(email="other@rauf.com", password="password", role="vet")
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password", role="pet_owner")
        self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
        self.consultation = Consultation.objects.create(pet=self.pet, owner=self.owner, vet=self.vet)
        
        self.create_url = reverse("medical-records-list") 
        self.client.force_authenticate(user=self.vet)

    def test_create_medical_record_by_vet(self):
        data = {"consultation_id": self.consultation.id, "notes": "تشخيص أول"}
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_medical_record_by_unauthorized_user(self):
        self.client.force_authenticate(user=self.owner)
        data = {"consultation_id": self.consultation.id, "notes": "هذا لا يجب أن يحدث"}
        response = self.client.post(self.create_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)