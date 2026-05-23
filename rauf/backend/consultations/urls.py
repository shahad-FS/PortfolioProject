from django.urls import path
from .views import (
    ConsultationCreateView,
    ConsultationCancelView,
    ConsultationVetUpdateView,
    MyAppointmentsView,
    
)

urlpatterns = [
    path("book/", ConsultationCreateView.as_view()),

    path(
        "my-appointments/",
        MyAppointmentsView.as_view()
    ),

    path(
        "<int:pk>/cancel/",
        ConsultationCancelView.as_view()
    ),

    path(
        "<int:pk>/vet-update/",
        ConsultationVetUpdateView.as_view()
    ),

]
