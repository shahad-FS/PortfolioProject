from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from pets.models import Pet
from consultations.models import Consultation

User = get_user_model()

class ConsultationViewsTests(APITestCase):

    def setUp(self):
            self.owner = User.objects.create_user(email="owner@rauf.com", password="password123", role="pet_owner")
            self.other_owner = User.objects.create_user(email="other@rauf.com", password="password123", role="pet_owner")
            self.vet = User.objects.create_user(email="vet@rauf.com", password="password123", role="vet")
            self.other_vet = User.objects.create_user(email="other_vet@rauf.com", password="password123", role="vet")
            
            self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
            
            self.consultation = Consultation.objects.create(
                pet=self.pet, owner=self.owner, vet=self.vet, session_price=100.00
            )
            
            
            self.create_url = reverse('consultation-create')
            self.cancel_url = reverse('consultation-cancel', kwargs={'pk': self.consultation.pk})
            self.vet_update_url = reverse('consultation-vet-update', kwargs={'pk': self.consultation.pk})
            self.my_appointments_url = reverse('my-appointments')

    @patch('core.services.email_service.EmailService.send_consultation_confirmation')
    @patch('core.services.email_service.EmailService.send_vet_notification')
    def test_create_consultation_view(self, mock_vet_email, mock_owner_email):
        self.client.force_authenticate(user=self.owner)
        data = {"pet": self.pet.id, "vet": self.vet.id}
        
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        
        mock_owner_email.assert_called_once()
        mock_vet_email.assert_called_once()

    def test_owner_can_cancel_consultation(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(self.cancel_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.consultation.refresh_from_db()
        self.assertEqual(self.consultation.status, "cancelled")

    def test_other_owner_cannot_cancel_consultation(self):
        self.client.force_authenticate(user=self.other_owner)
        response = self.client.post(self.cancel_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assigned_vet_can_update_status(self):
        self.client.force_authenticate(user=self.vet)
        response = self.client.post(self.vet_update_url, {"action": "started"})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.consultation.refresh_from_db()
        self.assertEqual(self.consultation.status, "started")

    def test_unassigned_vet_cannot_update_status(self):
        self.client.force_authenticate(user=self.other_vet)
        response = self.client.post(self.vet_update_url, {"action": "started"})
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_my_appointments_filtering(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(self.my_appointments_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)