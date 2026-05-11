from django.urls import re_path
from .consumers import AppointmentsConsumer, VideoCallConsumer

websocket_urlpatterns = [
    re_path(r"ws/video/(?P<consultation_id>\d+)/$",
            VideoCallConsumer.as_asgi()),
    re_path(r"ws/appointments/$", AppointmentsConsumer.as_asgi()),

]
