from django.urls import path
from .views import CreateVideoSessionView, StartVideoCallView, start_video_call

urlpatterns = [
    path(
        "create/<int:consultation_id>/",
        CreateVideoSessionView.as_view()
    ),
    path("start/<consultation_id>/", start_video_call, name="start-video-call"),
]
