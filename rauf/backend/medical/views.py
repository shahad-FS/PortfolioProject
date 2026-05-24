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
from core.permissions.roles import (
    IsVet, 
    IsVetOrPetOwner, 
    IsConsultationVet
)

class MedicalRecordCreateView(generics.CreateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsVet]
    def perform_create(self, serializer):
        serializer.save()


class MedicalRecordDetailView(generics.RetrieveUpdateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsConsultationVet()] 
        return [IsVetOrPetOwner()]

class MedicalRecordByConsultationView(generics.RetrieveAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsVetOrPetOwner]

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


class DiagnosisCreateView(generics.CreateAPIView):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer
    permission_classes = [IsVet]


class PrescriptionCreateView(generics.CreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsVet]
