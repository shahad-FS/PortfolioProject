from django.urls import re_path
from .consumers import VideoCallConsumer

websocket_urlpatterns = [
    re_path(
        r"ws/video/(?P<session_id>[0-9a-f-]+)/$", VideoCallConsumer.as_asgi()),
]
