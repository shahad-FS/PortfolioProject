from django.test import TestCase
from django.contrib.auth import get_user_model
from pets.models import Pet
from pets.serializers import PetSerializer
from datetime import datetime

User = get_user_model()

class PetSerializerTests(TestCase):

    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@rauf.com", password="password123", role="pet_owner"
        )
        self.pet = Pet.objects.create(
            owner=self.owner, name="فستق", type="cat", birth_year=2022
        )

    def test_serializer_outputs_correct_fields(self):
        serializer = PetSerializer(instance=self.pet)
        data = serializer.data

        current_year = datetime.now().year
        expected_age = current_year - self.pet.birth_year

        self.assertEqual(data['name'], "فستق")
        self.assertEqual(data['age'], expected_age)
        self.assertEqual(data['owner'], self.owner.id)

    def test_serializer_read_only_fields(self):
        another_user = User.objects.create_user(
            email="hack@rauf.com", password="password123", role="pet_owner"
        )
        invalid_data = {
            "name": "فستق المعدل",
            "type": "cat",
            "birth_year": 2022,
            "owner": another_user.id  
        }
        
        serializer = PetSerializer(data=invalid_data)
        self.assertTrue(serializer.is_valid())
    