from django.urls import re_path
from .consumers import AppointmentsConsumer

websocket_urlpatterns = [
    re_path(r"ws/appointments/$", AppointmentsConsumer.as_asgi()),
]
