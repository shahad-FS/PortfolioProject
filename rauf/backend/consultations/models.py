from django.db import models


from django.db import models
from django.conf import settings
from pets.models import Pet
from accounts.models import VetProfile
# Create your models here.


class Consultation(models.Model):

    """
    هذا يمثل جلسة بين Pet Owner و Vet
    """

    STATUS_CHOICES = (
        ("booked", "Booked"),
        ("cancelled", "Cancelled"),
        ("started", "Started"),
        ("ended", "Ended"),
    )

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pet_consultations"
    )

    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vet_consultations"
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="booked")

    scheduled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    session_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        
        if not self.id:
            try:
                # 💡 المحاولة الأولى: إذا كانت العلاقة العكسية تدعى 'vet' كما يظهر بالـ Serializers
                if hasattr(self.vet, 'vet'):
                    self.session_price = self.vet.vet.session_price
                # 💡 المحاولة الثانية: إذا كانت تدعى 'vetprofile'
                elif hasattr(self.vet, 'vetprofile'):
                    self.session_price = self.vet.vetprofile.session_price
                else:
                    # إذا لم يعثر على الملف الشخصي، نضع القيمة الافتراضية
                    self.session_price = 100.00
            except AttributeError:
                self.session_price = 100.00  
                
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Consultation {self.id} - Owner: {self.owner.email} with Vet: {self.vet.email}"
