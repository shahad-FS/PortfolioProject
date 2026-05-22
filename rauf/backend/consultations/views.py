from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer
from rest_framework import status

from core.permissions.roles import IsPetOwner, IsVet, IsVetOrPetOwner
from core.services.email_service import EmailService


class ConsultationCreateView(generics.CreateAPIView):
    """
    Pet Owner يحجز Consultation
    """

    serializer_class = ConsultationSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    permission_classes = [IsPetOwner]

    def perform_create(self, serializer):
        consultation = serializer.save(owner=self.request.user)
        vet_user = serializer.validated_data.get('vet')
        
        session_price = getattr(vet_user, 'vet', None).session_price if hasattr(vet_user, 'vet') else 100.00
        
        consultation = serializer.save(
            owner=self.request.user,
            price=session_price  
        )

        # ايميل للـ Pet Owner
        EmailService.send_consultation_confirmation(
            self.request.user,
            consultation
        )

        # إرسال إيميل للـ Vet
        EmailService.send_vet_notification(
            consultation.vet,
            consultation
        )


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

        # تأكد أن هذا الـ vet هو صاحب الموعد
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