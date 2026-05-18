"""إعداد WSGI لمشروع Raouf."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "raouf.settings")

application = get_wsgi_application()
