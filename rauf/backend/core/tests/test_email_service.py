import pytest
from django.core import mail
from core.services.email_service import EmailService
from unittest.mock import MagicMock

class TestEmailService:

    def test_send_verification_email(self):
        user = MagicMock()
        user.email = "owner@example.com"
        EmailService.send_verification_email(user, "token123")
        assert len(mail.outbox) == 1
        assert "Verify your email" in mail.outbox[0].subject

    def test_send_consultation_confirmation(self):
        user = MagicMock()
        user.email = "owner@example.com"
        consultation = MagicMock()
        consultation.pet.name = "Buddy"
        consultation.scheduled_at = "2026-05-23"
        consultation.vet.email = "vet@example.com"
        
        EmailService.send_consultation_confirmation(user, consultation)
        assert len(mail.outbox) == 1
        assert "Consultation Confirmed" in mail.outbox[0].subject

    def test_send_vet_notification(self):
        vet = MagicMock()
        vet.email = "vet@example.com"
        consultation = MagicMock()
        consultation.pet.name = "Buddy"
        consultation.pet.owner.email = "owner@example.com"
        consultation.scheduled_at = "2026-05-23"
        
        EmailService.send_vet_notification(vet, consultation)
        assert len(mail.outbox) == 1
        assert "New Consultation Request" in mail.outbox[0].subject