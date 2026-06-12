from django.urls import path
from .views import (
    ConsultationCreateView,
    ConsultationUpdateStatusView,
    # ConsultationCancelView,
    # ConsultationVetUpdateView,
    MyAppointmentsView,
    
)

urlpatterns = [
    path("book/", ConsultationCreateView.as_view(), name="consultation-create"),

    path("my-appointments/", MyAppointmentsView.as_view(), name="my-appointments"),

    # path(
    #     "<int:pk>/cancel/",
    #     ConsultationCancelView.as_view(), name="consultation-cancel"
    # ),

    # path(
    #     "<int:pk>/vet-update/",
    #     ConsultationVetUpdateView.as_view(), name="consultation-vet-update"
    # ),

    path("<int:pk>/update-status/", ConsultationUpdateStatusView.as_view(), name="consultation-update-status"),

]
