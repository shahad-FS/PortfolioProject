from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, VetProfile, PetOwnerProfile

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