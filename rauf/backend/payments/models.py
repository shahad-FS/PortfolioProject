from django.db import models
from consultations.models import Consultation
from django.conf import settings

# Create your models here.

class PaymentTransaction(models.Model):

    STATUS_CHOICES = [
        ('initiated', 'Initiated'),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    consultation = models.ForeignKey('consultations.Consultation', on_delete=models.CASCADE, related_name='payments')
    moyasar_payment_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='SAR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='initiated')
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.id} - {self.owner.email} - {self.status}"