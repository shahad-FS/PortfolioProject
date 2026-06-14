from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from pets.models import Pet

User = get_user_model()

class PetViewsTests(APITestCase):

    def setUp(self):
        
        self.pet_owner = User.objects.create_user(email="owner@rauf.com", password="password123", role="pet_owner")
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password123", role="vet")
        self.admin = User.objects.create_user(email="admin@rauf.com", password="password123", role="admin")
        
        
        self.pet = Pet.objects.create(owner=self.pet_owner, name="مشمش", type="cat", birth_year=2023)
        
        
        self.list_create_url = reverse('pet-list-create') 
        self.detail_url = reverse('pet-detail', kwargs={'pk': self.pet.pk})

    def test_pet_owner_can_create_pet(self):
        self.client.force_authenticate(user=self.pet_owner)
        data = {"name": "ركس", "type": "dog", "birth_year": 2024}
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pet.objects.filter(owner=self.pet_owner).count(), 2)

    def test_vet_cannot_create_pet(self):
        self.client.force_authenticate(user=self.vet)
        data = {"name": "سيمبا", "type": "lion", "birth_year": 2025}
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_pet_owner_only_sees_their_own_pets(self):
        another_owner = User.objects.create_user(email="other@rauf.com", password="password123", role="pet_owner")
        Pet.objects.create(owner=another_owner, name="زعتر", type="rabbit", birth_year=2024)
        
        self.client.force_authenticate(user=self.pet_owner)
        response = self.client.get(self.list_create_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
        self.assertEqual(response.data[0]['name'], "مشمش")

    def test_admin_can_see_all_pets(self):
        another_owner = User.objects.create_user(email="other@rauf.com", password="password123", role="pet_owner")
        Pet.objects.create(owner=another_owner, name="زعتر", type="rabbit", birth_year=2024)
        
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_create_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) 

    def test_update_pet_only_by_owner(self):
        another_owner = User.objects.create_user(email="other@rauf.com", password="password123", role="pet_owner")
        
        
        self.client.force_authenticate(user=another_owner)
        response = self.client.put(self.detail_url, {"name": "اسم هجومي", "type": "cat", "birth_year": 2023})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        
        self.client.force_authenticate(user=self.pet_owner)
        response = self.client.put(self.detail_url, {"name": "مشمش المعدل", "type": "cat", "birth_year": 2023})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pet.refresh_from_db()
        self.assertEqual(self.pet.name, "مشمش المعدل")


    def test_vet_can_list_assigned_pets(self):
        self.client.force_authenticate(user=self.vet)
        response = self.client.get(self.list_create_url)
        
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)