"""إعداد ASGI لمشروع Raouf."""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "raouf.settings")

application = get_asgi_application()
