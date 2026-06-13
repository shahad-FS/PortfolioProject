from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, VetProfile, PetOwnerProfile
from django_rest_passwordreset.signals import reset_password_token_created
from core.services.email_service import EmailService

#signal 
#يشتغل تلقائيا بعد ما يتم حفظ مستخدم جديد في قاعدة البيانات
@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:

        Profile.objects.get_or_create(user=instance)

        if instance.role == "pet_owner":
            PetOwnerProfile.objects.get_or_create(user=instance)

        elif instance.role == "vet":
            VetProfile.objects.get_or_create(user=instance)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    user = reset_password_token.user
    token = reset_password_token.key
        
    EmailService.send_password_reset_email(user, token)