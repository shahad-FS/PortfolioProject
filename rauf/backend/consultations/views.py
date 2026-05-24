import logging
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer
from rest_framework import status

from core.permissions.roles import IsPetOwner, IsVet, IsVetOrPetOwner
from core.services.email_service import EmailService

logger = logging.getLogger(__name__)
class ConsultationCreateView(generics.CreateAPIView):
    """
    Pet Owner يحجز Consultation
    """

    serializer_class = ConsultationSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    permission_classes = [IsPetOwner]

    def perform_create(self, serializer):
        vet_user = serializer.validated_data.get('vet')
        
        if hasattr(vet_user, 'vetprofile'):
            session_price = vet_user.vetprofile.session_price
        elif hasattr(vet_user, 'profile'):
            session_price = vet_user.profile.session_price
        elif hasattr(vet_user, 'vet'):
            session_price = vet_user.vet.session_price
        else:
            session_price = 100.00

        consultation = serializer.save(
            owner=self.request.user,
            session_price=session_price
        )
        try:
            EmailService.send_consultation_confirmation(
                self.request.user,
                consultation
            )

            EmailService.send_vet_notification(
                consultation.vet,
                consultation
            )
        except Exception as e:
            logger.error(f"Email notification failed for consultation {consultation.id}: {e}")


class ConsultationCancelView(generics.UpdateAPIView):
    permission_classes = [IsPetOwner]
    serializer_class = ConsultationSerializer

    queryset = Consultation.objects.all()

    def post(self, request, *args, **kwargs):
        consultation = self.get_object()

        if consultation.owner != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        consultation.status = "cancelled"
        consultation.save()

        return Response({"message": "Cancelled", "status": consultation.status}, status=200)


class ConsultationVetUpdateView(generics.UpdateAPIView):
    permission_classes = [IsVet]
    serializer_class = ConsultationSerializer
    queryset = Consultation.objects.all()

    def patch(self, request, *args, **kwargs):
        return self.handle_update(request)

    def post(self, request, *args, **kwargs):
        return self.handle_update(request)

    def handle_update(self, request):
        consultation = self.get_object()

        if consultation.vet != request.user:
            return Response(
                {"error": "Not your appointment"},
                status=status.HTTP_403_FORBIDDEN
            )

        action = request.data.get("action") or request.data.get("status")

        if action in ["start", "started"]:
            consultation.status = "started"
        elif action in ["end", "ended"]:
            consultation.status = "ended"
        elif action in ["cancel", "cancelled"]:
            consultation.status = "cancelled"
        else:
            return Response(
                {"error": "Invalid action"},
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation.save()

        return Response({
            "message": f"Appointment updated to {consultation.status}",
            "status": consultation.status
        }, status=status.HTTP_200_OK)


class MyAppointmentsView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsVetOrPetOwner]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, 'role', None) == "vet":
            return Consultation.objects.filter(vet=user).order_by("-created_at")

        return Consultation.objects.filter(owner=user).order_by("-created_at")