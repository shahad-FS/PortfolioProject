from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
import uuid
from django.utils import timezone


# مسؤول عن انشاء المستخدمين العاديين والمشرفين
class UserManager(BaseUserManager):
    # دالة لإنشاء مستخدم عادي
    def create_user(self, email, password, role="pet_owner", **extra_fields):
        # التحقق من وجود الايميل اجباري
        if not email:
            raise ValueError("Email is required")
        # التحقق من وجود كلمة المرور اجباري
        if not password:
            raise ValueError("Password is required")
        # توحيد صيغة الايميل (clean + lowercase)
        email = self.normalize_email(email)

        # انشاء المستخدم
        user = self.model(email=email, role=role, **extra_fields)

        # تعيين كلمة المرور (تشفيرها) بدل تخزينها كنص عادي
        user.set_password(password)
        # حفظ المستخدم في قاعدة البيانات
        user.save(using=self._db)
        return user

    # دالة انشاء مستخدم مشرف (superuser)
    def create_superuser(self, email, password, **extra_fields):
        # اتشاء مستخدم عادي مع دور "admin"
        user = self.create_user(email, password, role="admin", **extra_fields)
        # تعيين صلاحيات admin panel
        user.is_staff = True
        # اعطاء صلاحيات superuser
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    # انواع المستخدمين المتاحة في النظام
    ROLE_CHOICES = (
        ("pet_owner", "Pet Owner"),
        ("vet", "Veterinarian"),
        ("admin", "Admin"),
    )

    # الايميل هو الحقل الاساسي بدل username
    email = models.EmailField(unique=True)
    # الدور (نوع المستخدم)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # حقول الحالة للمستخدم
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    # هل المستخدمل تم التحقق من ايميله (مثلا عن طريق رابط تفعيل)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    # تحديد الحقل المستخدمل لتسجيل الدخول
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


def default_expiry():
    return timezone.now() + timedelta(hours=24)


class EmailVerificationToken(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)

    is_used = models.BooleanField(default=False)

    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["user", "is_used"]),
        ]

    def is_expired(self):
        return timezone.now() > self.expires_at

    def mark_used(self):
        self.is_used = True
        self.used_at = timezone.now()
        self.save(update_fields=["is_used", "used_at"])


# مودل عام يحتوي معلومات مشتركة بين جميع المستخدمين (سواء مالك حيوان أو طبيب بيطري) يسهل التوسع بالمستقبل
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Profile - {self.user.email}"


class PetOwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"PetOwner - {self.user.email}"


class VetProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    specialization = models.CharField(max_length=100, blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Vet - {self.user.email}"
