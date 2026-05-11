from django.urls import path

from .views import (
    MedicalRecordCreateView,
    MedicalRecordDetailView,
    MedicalRecordByConsultationView,
    DiagnosisCreateView,
    PrescriptionCreateView
)

urlpatterns = [
    # ================= MEDICAL RECORD =================
    path(
        "medical-records/",
        MedicalRecordCreateView.as_view()
    ),

    path(
        "medical-records/<int:pk>/",
        MedicalRecordDetailView.as_view()
    ),

    path(
        "medical-records/consultation/<int:consultation_id>/",
        MedicalRecordByConsultationView.as_view()
    ),

    # ================= DIAGNOSIS =================
    path(
        "diagnoses/",
        DiagnosisCreateView.as_view()
    ),

    # ================= PRESCRIPTIONS =================
    path(
        "prescriptions/",
        PrescriptionCreateView.as_view()
    ),
]
