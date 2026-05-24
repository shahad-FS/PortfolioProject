from django.test import TestCase
from django.contrib.auth import get_user_model
from pets.models import Pet

User = get_user_model()

class PetModelTests(TestCase):

    def setUp(self):
      
        self.owner = User.objects.create_user(
            email="petowner@rauf.com",
            password="Password123!",
            role="pet_owner"
        )

    def test_create_pet_successful(self):
       
        pet = Pet.objects.create(
            owner=self.owner,
            name="مشمش",
            type="cat",
            breed="Shirazi",
            birth_year=2024
        )

        self.assertEqual(pet.name, "مشمش")
        self.assertEqual(pet.type, "cat")
        self.assertEqual(pet.breed, "Shirazi")
        self.assertEqual(pet.birth_year, 2024)
        self.assertEqual(pet.owner, self.owner)
        self.assertIsNotNone(pet.created_at)

    def test_create_pet_with_optional_breed(self):
        
        pet = Pet.objects.create(
            owner=self.owner,
            name="ركس",
            type="dog",
            birth_year=2023
        )

        self.assertEqual(pet.name, "ركس")
        self.assertIsNone(pet.breed)  
    def test_pet_string_representation(self):
      
        pet = Pet.objects.create(
            owner=self.owner,
            name="زعتر",
            type="rabbit",
            birth_year=2025
        )

        self.assertEqual(str(pet), "زعتر")