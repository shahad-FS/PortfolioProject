from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer

from core.permissions.roles import IsPetOwner, IsVet
from core.services.email_service import EmailService


class ConsultationCreateView(generics.CreateAPIView):
    """
    🟢 Pet Owner يحجز Consultation
    """

    serializer_class = ConsultationSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    permission_classes = [IsPetOwner]

    def perform_create(self, serializer):
        consultation = serializer.save(pet_owner=self.request.user)

        # 📧 إرسال إيميل للـ Pet Owner
        EmailService.send_email(
            self.request.user.email,
            "Booking Confirmed",
            "Your consultation is booked."
        )

        # 📧 إرسال إيميل للـ Vet
        EmailService.send_email(
            consultation.vet.email,
            "New Consultation Booked",
            "You have a new consultation."
        )


class ConsultationCancelView(generics.UpdateAPIView):
    permission_classes = [IsPetOwner]

    def post(self, request, *args, **kwargs):
        consultation = self.get_object()

        if consultation.pet_owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        consultation.status = "cancelled"
        consultation.save()

        return Response({"message": "Cancelled"})


class ConsultationVetUpdateView(generics.UpdateAPIView):
    permission_classes = [IsVet]

    def post(self, request, *args, **kwargs):
        consultation = self.get_object()

        if consultation.vet != request.user:
            return Response({"error": "Not your session"}, status=403)

        action = request.data.get("action")

        if action == "start":
            consultation.status = "started"

        elif action == "end":
            consultation.status = "ended"

        consultation.save()

        return Response({"message": f"Session {action}ed"})
