import uuid
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from accounts.models import EmailVerificationToken, Profile, VetProfile

User = get_user_model()

class AccountsAuthTests(APITestCase):

    def setUp(self):
        """
        تجهيز الروابط والبيانات
        """
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.vet_list_url = reverse('vet-list')
        
        self.register_data = {
            "email": "doctor.test@rauf.com",
            "password": "RaufSecurePass123",
            "role": "vet"
        }

    @patch('core.services.email_service.EmailService.send_verification_email')
    def test_register_user_success(self, mock_send_email):
        
        response = self.client.post(self.register_url, self.register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Check your email", response.data["message"])
        
        user = User.objects.get(email=self.register_data["email"])
        self.assertFalse(user.is_verified)
        
        self.assertTrue(EmailVerificationToken.objects.filter(user=user).exists())
        mock_send_email.assert_called_once()

    def test_register_duplicate_email_fails(self):
        """
        اختبار ايميل موجود
        """
        User.objects.create_user(email=self.register_data["email"], password=self.register_data["password"])
        
        response = self.client.post(self.register_url, self.register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_verify_email_flow(self):
        
        user = User.objects.create_user(email=self.register_data["email"], password=self.register_data["password"])
        token_obj = EmailVerificationToken.objects.create(user=user)
        

        invalid_uuid = uuid.uuid4()
        response = self.client.get(f"/api/v1/accounts/verify-email/{invalid_uuid}/")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("status=invalid", response.url)

        response = self.client.get(f"/api/v1/accounts/verify-email/{token_obj.token}/")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        
        user.refresh_from_db()
        token_obj.refresh_from_db()
        self.assertTrue(user.is_verified)
        self.assertTrue(user.is_active)
        self.assertTrue(token_obj.is_used)

    def test_login_flow(self):
    
        user = User.objects.create_user(email=self.register_data["email"], password=self.register_data["password"])
        user.is_active = False 
        user.save()
        
        login_payload = {
            "email": self.register_data["email"],
            "password": self.register_data["password"]
        }


        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        
        user.is_verified = True
        user.is_active = True
        user.save()
        
        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_authenticated_profile_access_and_patch(self):
       
        user = User.objects.create_user(
            email=self.register_data["email"], 
            password=self.register_data["password"], 
            role="vet"
        )
        user.is_verified = True
        user.is_active = True
        user.save()

        
        profile = Profile.objects.get(user=user)
        profile.full_name = "Dr. Khaled"
        profile.save()

        vet_profile = VetProfile.objects.get(user=user)
        vet_profile.license_number = "12345"
        vet_profile.save()

        
        login_response = self.client.post(self.login_url, {
            "email": self.register_data["email"],
            "password": self.register_data["password"]
        }, format='json')
        
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        
        response = self.client.get("/api/v1/accounts/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["profile"]["full_name"], "Dr. Khaled")

        
        update_payload = {
            "profile": {"full_name": "Dr. Khaled Al-Saneea"},
            "vet": {"specialization": "Cats Expert", "session_price": 150.00}
        }
        response = self.client.patch("/api/v1/accounts/profile/", update_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["profile"]["full_name"], "Dr. Khaled Al-Saneea")

    def test_vet_list_shows_only_verified_vets(self):
        
        
        vet1 = User.objects.create_user(email="vet1@rauf.com", password="password123", role="vet")
        vet1.is_verified = True
        vet1.is_active = True
        vet1.save()
        
        profile1 = Profile.objects.get(user=vet1)
        profile1.full_name = "Verified Vet"
        profile1.save()

        
        vet2 = User.objects.create_user(email="vet2@rauf.com", password="password123", role="vet")
        vet2.is_verified = False
        vet2.is_active = False
        vet2.save()

        response = self.client.get(self.vet_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        results = response.data["results"] if "results" in response.data else response.data
        self.assertEqual(len(results), 1)