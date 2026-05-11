from rest_framework import generics, status
from rest_framework.response import Response

from .models import (
    MedicalRecord,
    Diagnosis,
    Prescription
)

from .serializers import (
    MedicalRecordSerializer,
    DiagnosisSerializer,
    PrescriptionSerializer
)


# ================= MEDICAL RECORD =================

class MedicalRecordCreateView(generics.CreateAPIView):
    serializer_class = MedicalRecordSerializer

    def perform_create(self, serializer):
        serializer.save()


class MedicalRecordDetailView(generics.RetrieveUpdateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer


class MedicalRecordByConsultationView(generics.RetrieveAPIView):
    serializer_class = MedicalRecordSerializer

    def retrieve(self, request, *args, **kwargs):
        consultation_id = self.kwargs["consultation_id"]

        try:
            medical_record = MedicalRecord.objects.get(
                consultation_id=consultation_id
            )

            serializer = self.get_serializer(medical_record)

            return Response({
                "exists": True,
                "medical_record": serializer.data
            })

        except MedicalRecord.DoesNotExist:
            return Response({
                "exists": False
            })


# ================= DIAGNOSIS =================

class DiagnosisCreateView(generics.CreateAPIView):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer


# ================= PRESCRIPTION =================

class PrescriptionCreateView(generics.CreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
