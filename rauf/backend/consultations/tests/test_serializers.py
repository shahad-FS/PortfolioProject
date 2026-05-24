from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory
from pets.models import Pet
from consultations.serializers import ConsultationSerializer

User = get_user_model()

class ConsultationSerializerTests(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        
        
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password123", role="pet_owner")
        self.other_owner = User.objects.create_user(email="other@rauf.com", password="password123", role="pet_owner")
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password123", role="vet")
        self.not_a_vet = User.objects.create_user(email="notvet@rauf.com", password="password123", role="pet_owner")
        
        
        self.my_pet = Pet.objects.create(owner=self.owner, name="مشمش", type="cat", birth_year=2023)
        
        self.other_pet = Pet.objects.create(owner=self.other_owner, name="ركس", type="dog", birth_year=2022)

    def test_serializer_validation_success(self):
        request = self.factory.post('/')
        request.user = self.owner
        
        data = {"pet": self.my_pet.id, "vet": self.vet.id, "session_price": "100.00"}
        
        serializer = ConsultationSerializer(data=data, context={"request": request})
        self.assertTrue(serializer.is_valid())

    def test_serializer_validation_fails_for_foreign_pet(self):
        request = self.factory.post('/')
        request.user = self.owner
        
        data = {"pet": self.other_pet.id, "vet": self.vet.id}
        
        serializer = ConsultationSerializer(data=data, context={"request": request})
        with self.assertRaises(ValidationError) as ctx:
            serializer.is_valid(raise_exception=True)
        self.assertIn("You can only book consultations for your own pets.", str(ctx.exception))

    def test_serializer_validation_fails_if_target_is_not_vet(self):
        request = self.factory.post('/')
        request.user = self.owner
        
        data = {"pet": self.my_pet.id, "vet": self.not_a_vet.id}
        
        serializer = ConsultationSerializer(data=data, context={"request": request})
        with self.assertRaises(ValidationError) as ctx:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Selected user is not a vet.", str(ctx.exception))

    
    def test_serializer_fails_if_session_price_is_zero_or_negative(self):
        request = self.factory.post('/')
        request.user = self.owner
        
        
        data_zero = {"pet": self.my_pet.id, "vet": self.vet.id, "session_price": "0.00"}
        serializer_zero = ConsultationSerializer(data=data_zero, context={"request": request})
        self.assertFalse(serializer_zero.is_valid())
        self.assertIn("session_price", serializer_zero.errors)

        
        data_negative = {"pet": self.my_pet.id, "vet": self.vet.id, "session_price": "-15.00"}
        serializer_negative = ConsultationSerializer(data=data_negative, context={"request": request})
        self.assertFalse(serializer_negative.is_valid())
        self.assertIn("session_price", serializer_negative.errors)