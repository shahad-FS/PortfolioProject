import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from pets.models import Pet
from video_sessions.models import VideoSession
from consultations.models import Consultation
from accounts.models import VetProfile, PetOwnerProfile
from video_sessions.tests.factories import VideoSessionFactory

User = get_user_model()

@pytest.mark.django_db
class TestVideoSessionViews(APITestCase):

    @classmethod
    def setUpTestData(cls):
        
        cls.vet, _ = User.objects.get_or_create(
            email="vet@example.com",
            defaults={"password": "password", "role": "vet", "is_active": True}
        )
        cls.owner, _ = User.objects.get_or_create(
            email="owner@example.com",
            defaults={"password": "password", "role": "pet_owner", "is_active": True}
        )
        
        
        cls.vet_profile, _ = VetProfile.objects.get_or_create(
            user=cls.vet, defaults={"specialization": "General"}
        )
        cls.owner_profile, _ = PetOwnerProfile.objects.get_or_create(user=cls.owner)

        
        
        cls.pet, _ = Pet.objects.get_or_create(
            owner=cls.owner,
            defaults={"name": "Buddy", "type": "Dog","breed": "Unknown", "birth_year": 2020}
        )

        
        cls.consultation, _ = Consultation.objects.get_or_create(
            vet=cls.vet,
            owner=cls.owner,
            pet=cls.pet, 
            defaults={"status": "booked", "session_price": 100}
        )
        
        
        
        cls.session = VideoSessionFactory.create(consultation=cls.consultation)
        cls.session_url = reverse("get-video-session", kwargs={"session_id": str(cls.session.session_id)})
    def test_start_video_session(self):
        self.client.force_authenticate(user=self.vet)
        url = reverse("start-video-call", kwargs={"consultation_id": self.consultation.id})
        response = self.client.post(url)
        assert response.status_code == status.HTTP_200_OK

    def test_send_offer_view(self):
        self.client.force_authenticate(user=self.vet)
        url = reverse("send-offer", kwargs={"session_id": str(self.session.session_id)})
        data = {"offer": {"sdp": "test_sdp", "type": "offer"}}
        response = self.client.post(url, data, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_add_ice_candidate_view(self):
        self.client.force_authenticate(user=self.vet)
        url = reverse("add-ice-candidate", kwargs={"session_id": str(self.session.session_id)})
        data = {"candidate": {"candidate": "candidate_string", "sdpMid": "0"}}
        
        response = self.client.post(url, data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        self.session.refresh_from_db()
        assert len(self.session.ice_candidates) > 0

    def test_end_video_call_view(self):
        self.client.force_authenticate(user=self.vet)
        url = reverse("end-video-call", kwargs={"session_id": str(self.session.session_id)})
        
        response = self.client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        self.session.refresh_from_db()
        assert self.session.status == "ended"

    def test_get_video_session_view(self):
        self.client.force_authenticate(user=self.vet)
        response = self.client.get(self.session_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["session_id"] == str(self.session.session_id)

    def test_vet_permission_on_owner_view(self):
        """التأكد من أن الطبيب لا يمكنه إرسال answer (مخصص للمالك فقط)"""
        self.client.force_authenticate(user=self.vet)
        url = reverse("send-answer", kwargs={"session_id": str(self.session.session_id)})
        data = {"answer": {"sdp": "fake_sdp", "type": "answer"}}
        
        response = self.client.post(url, data, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_owner_permission_on_vet_view(self):
        """التأكد من أن المالك لا يمكنه إنهاء المكالمة (مخصص للطبيب فقط)"""
        self.client.force_authenticate(user=self.owner)
        url = reverse("end-video-call", kwargs={"session_id": str(self.session.session_id)})
        
        response = self.client.post(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_unauthenticated_user_access(self):
        """التأكد من أن المستخدم غير المسجل لا يمكنه الوصول للمسارات"""
        self.client.logout()
        url = reverse("end-video-call", kwargs={"session_id": str(self.session.session_id)})
        response = self.client.post(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED