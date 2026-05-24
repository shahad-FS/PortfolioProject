from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from django.contrib.auth import get_user_model
from payments.models import PaymentTransaction
from consultations.models import Consultation
from pets.models import Pet

User = get_user_model()

class PaymentViewsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user@rauf.com", password="password")
        self.pet = Pet.objects.create(owner=self.user, name="زعتر", type="rabbit", birth_year=2024)
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.consultation = Consultation.objects.create(
            pet=self.pet,
            owner=self.user,
            vet=self.vet,
            session_price=150.00)
        
        self.transaction = PaymentTransaction.objects.create(
            owner=self.user,
            consultation=self.consultation,
            amount=150.00
        )
        self.verify_url = reverse('verify-payment')
        self.client.force_authenticate(user=self.user)

    @patch('payments.views.MoyasarService.verify_payment')
    def test_verify_payment_success(self, mock_verify):
        mock_verify.return_value = {'status': 'paid'}
        
        data = {"payment_id": "pay_123", "transaction_id": self.transaction.id}
        response = self.client.post(self.verify_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.status, 'paid')
        self.consultation.refresh_from_db()
        self.assertTrue(self.consultation.is_paid)

    @patch('payments.views.MoyasarService.verify_payment')
    def test_verify_payment_failed(self, mock_verify):
        mock_verify.return_value = {'status': 'failed'}
        
        data = {"payment_id": "pay_123", "transaction_id": self.transaction.id}
        response = self.client.post(self.verify_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.status, 'failed')