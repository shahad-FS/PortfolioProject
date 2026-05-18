import os
import django

# إعداد Django قبل أي import آخر
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from video_sessions.routing import websocket_urlpatterns as video_ws
from consultations.routing import websocket_urlpatterns as appointments_ws

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            video_ws + appointments_ws
        )
    ),
})