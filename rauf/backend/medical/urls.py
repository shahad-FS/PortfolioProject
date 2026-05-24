from django.urls import path

from .views import (
    MedicalRecordCreateView,
    MedicalRecordDetailView,
    MedicalRecordByConsultationView,
    DiagnosisCreateView,
    PrescriptionCreateView
)

urlpatterns = [
    path(
        "medical-records/",
        MedicalRecordCreateView.as_view(),
        name="medical-records-list"
    ),

    path(
        "medical-records/<int:pk>/",
        MedicalRecordDetailView.as_view(),
        name="medical-record-detail"
    ),

    path(
        "medical-records/consultation/<int:consultation_id>/",
        MedicalRecordByConsultationView.as_view(),
        name="medical-record-by-consultation"
    ),
    path(
        "diagnoses/",
        DiagnosisCreateView.as_view(),
        name="diagnoses-list"
    ),
    path(
        "prescriptions/",
        PrescriptionCreateView.as_view(),
        name="prescriptions-list"
    ),
]
