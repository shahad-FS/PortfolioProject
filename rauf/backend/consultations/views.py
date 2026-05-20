from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer

from core.permissions.roles import IsPetOwner, IsVet
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
        # 1. نقوم بالوصول إلى الطبيب المختار قبل الحفظ النهائي لـ جلب سعره
        vet_user = serializer.validated_data.get('vet')
        
        # 2. نسحب السعر من كائن الـ vet المرتبط بالطبيب (حسب بنية قاعدة البيانات لديكِ)
        # إذا كان حقل السعر متواجد في الـ profile الفرعي للطبيب (Vet model) نصل إليه هكذا:
        session_price = getattr(vet_user, 'vet', None).session_price if hasattr(vet_user, 'vet') else 100.00
        
        # 3. 🔥 نمرر السعر الفعلي للطبيب أثناء الحفظ ليخزن في جدول الاستشارة بدقة
        # تأكدي إن اسم الحقل في موديل الـ Consultation هو 'price' أو 'session_price' وعدليه هنا بناءً عليه
        consultation = serializer.save(
            owner=self.request.user,
            price=session_price  # 👈 أو session_price=session_price حسب اسم الحقل عندك في موديل الاستشارة
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

    def post(self, request, *args, **kwargs):
        consultation = self.get_object()

        if consultation.owner != request.user:
            return Response({"error": "Not allowed"}, status=403)

        consultation.status = "cancelled"
        consultation.save()

        return Response({"message": "Cancelled"})


class ConsultationVetUpdateView(generics.UpdateAPIView):
    permission_classes = [IsVet]
    queryset = Consultation.objects.all()

    def post(self, request, *args, **kwargs):
        consultation = self.get_object()

        # تأكد أن هذا الـ vet هو صاحب الموعد
        if consultation.vet != request.user:
            return Response(
                {"error": "Not your appointment"},
                status=403
            )

        action = request.data.get("action")

        if action == "start":
            consultation.status = "started"

        elif action == "end":
            consultation.status = "ended"

        elif action == "cancel":
            consultation.status = "cancelled"

        else:
            return Response(
                {"error": "Invalid action"},
                status=400
            )

        consultation.save()

        return Response({
            "message": f"Appointment {action}ed",
            "status": consultation.status
        })


from core.permissions.roles import IsVetOrPetOwner

class MyAppointmentsView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsVetOrPetOwner]

    def get_queryset(self):
        user = self.request.user

        if user.role == "vet":
            return Consultation.objects.filter(
                vet=user
            ).order_by("-created_at")

        return Consultation.objects.filter(
            owner=user
        ).order_by("-created_at")
