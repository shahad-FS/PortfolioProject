from django.test import TestCase
from django.contrib.auth import get_user_model
from consultations.models import Consultation
from payments.models import PaymentTransaction
from pets.models import Pet

User = get_user_model()

class PaymentTransactionModelTests(TestCase):
    def setUp(self):
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password", role="pet_owner")
        
        
        self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
        
        
        self.consultation = Consultation.objects.create(pet=self.pet, owner=self.owner, vet=self.vet)

    def test_payment_creation(self):
        payment = PaymentTransaction.objects.create(
            owner=self.owner,
            consultation=self.consultation,
            amount=100.00
        )
        self.assertEqual(payment.status, 'initiated')
        self.assertEqual(payment.currency, 'SAR')
        self.assertEqual(payment.owner, self.owner)

    def test_payment_status_update(self):
        payment = PaymentTransaction.objects.create(
            owner=self.owner,
            consultation=self.consultation,
            amount=100.00,
            moyasar_payment_id="pay_12345"
        )
        payment.status = 'paid'
        payment.save()
        
        updated_payment = PaymentTransaction.objects.get(id=payment.id)
        self.assertEqual(updated_payment.status, 'paid')
        self.assertEqual(updated_payment.moyasar_payment_id, "pay_12345")

    def test_str_representation(self):
        payment = PaymentTransaction.objects.create(
            owner=self.owner,
            consultation=self.consultation,
            amount=50.00
        )
        expected_str = f"Payment {payment.id} - {self.owner.email} - initiated"
        self.assertEqual(str(payment), expected_str)