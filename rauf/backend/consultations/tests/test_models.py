from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from pets.models import Pet
from accounts.models import VetProfile  
from consultations.models import Consultation

User = get_user_model()

class ConsultationModelTests(TestCase):

    def setUp(self):
    
        self.owner = User.objects.create_user(
            email="owner@rauf.com", password="password123", role="pet_owner"
        )
        self.vet = User.objects.create_user(
            email="vet@rauf.com", password="password123", role="vet"
        )
        self.pet = Pet.objects.create(
            owner=self.owner, name="مشمش", type="cat", birth_year=2023
        )
        self.scheduled_time = timezone.now() + timezone.timedelta(days=1)

    def test_create_consultation_with_default_status(self):
   
        consultation = Consultation.objects.create(
            pet=self.pet,
            owner=self.owner,
            vet=self.vet,
            scheduled_at=self.scheduled_time,
            session_price=120.00  
        )

        self.assertEqual(consultation.status, "booked")
        self.assertEqual(consultation.pet, self.pet)
        self.assertEqual(consultation.owner, self.owner)
        self.assertEqual(consultation.vet, self.vet)
        self.assertFalse(consultation.is_paid)

    def test_auto_session_price_from_vet_profile(self):
           
            
            vet_profile, created = VetProfile.objects.update_or_create(
                user=self.vet,
                defaults={"session_price": 180.00}
            )

            
            consultation = Consultation.objects.create(
                pet=self.pet,
                owner=self.owner,
                vet=self.vet,
                scheduled_at=self.scheduled_time
            )

            self.assertEqual(float(consultation.session_price), 180.00)

    def test_fallback_session_price(self):
        consultation = Consultation.objects.create(
            pet=self.pet,
            owner=self.owner,
            vet=self.vet,
            scheduled_at=self.scheduled_time
        )

        
        self.assertEqual(float(consultation.session_price), 100.00)

    def test_consultation_string_representation(self):
        consultation = Consultation.objects.create(
            pet=self.pet,
            owner=self.owner,
            vet=self.vet,
            scheduled_at=self.scheduled_time,
            session_price=100.00
        )

        expected_str = f"Consultation {consultation.id} - Owner: {self.owner.email} with Vet: {self.vet.email}"
        self.assertEqual(str(consultation), expected_str)