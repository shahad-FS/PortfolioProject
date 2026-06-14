from django.urls import path
from .views import CreatePaymentIntentView, VerifyPaymentView, MoyasarWebhookView

urlpatterns = [
    path('create-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('webhook/', MoyasarWebhookView.as_view(), name='moyasar-webhook'),
]