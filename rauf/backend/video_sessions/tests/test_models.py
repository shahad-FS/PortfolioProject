from django.test import TestCase
from django.contrib.auth import get_user_model
from consultations.models import Consultation
from video_sessions.models import VideoSession
from pets.models import Pet

User = get_user_model()

class VideoSessionModelTests(TestCase):
    def setUp(self):
        
        self.owner = User.objects.create_user(email="owner@rauf.com", password="password")
        self.vet = User.objects.create_user(email="vet@rauf.com", password="password", role="vet")
        self.pet = Pet.objects.create(owner=self.owner, name="زعتر", type="rabbit", birth_year=2024)
        
        
        self.consultation = Consultation.objects.create(
            pet=self.pet, owner=self.owner, vet=self.vet, session_price=100.00
        )

    def test_create_video_session(self):
        session = VideoSession.objects.create(
            consultation=self.consultation,
            join_url="https://rauf.clinic/video/123"
        )
        self.assertEqual(session.status, "waiting")
        self.assertFalse(session.vet_joined)
        self.assertFalse(session.owner_joined)
        self.assertEqual(session.consultation, self.consultation)

    def test_session_state_updates(self):
        session = VideoSession.objects.create(
            consultation=self.consultation,
            join_url="https://rauf.clinic/video/123"
        )
        session.status = "started"
        session.vet_joined = True
        session.owner_joined = True
        session.save()
        
        updated_session = VideoSession.objects.get(id=session.id)
        self.assertEqual(updated_session.status, "started")
        self.assertTrue(updated_session.vet_joined)
        self.assertTrue(updated_session.owner_joined)