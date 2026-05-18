"""
نماذج بيانات منصة Raouf.

تشمل:
- User: مستخدم مخصّص يدعم نوعين (صاحب قطة / طبيب بيطري).
- DoctorProfile: ملف الطبيب البيطري، يحوي سنة بداية العمل وميثود حساب الخبرة.
- SiteSetting: إعدادات عامة للموقع (مثل سنة بداية عمل المنصة).
- OtpCode: رموز التحقق المرسلة للمستخدمين.
"""
from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


# ══════════════════════════════════════════════════════════════════
# مدير المستخدم المخصّص
# ══════════════════════════════════════════════════════════════════
class UserManager(BaseUserManager):
    """مدير مستخدم يعتمد البريد الإلكتروني بدل اسم المستخدم."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("البريد الإلكتروني مطلوب.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("user_type", User.UserType.OWNER)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("المستخدم المشرف يجب أن يكون is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("المستخدم المشرف يجب أن يكون is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


# ══════════════════════════════════════════════════════════════════
# نموذج المستخدم
# ══════════════════════════════════════════════════════════════════
class User(AbstractUser):
    """
    مستخدم منصة Raouf.

    يلغي حقل username ويعتمد البريد الإلكتروني كمعرّف للدخول.
    """

    class UserType(models.TextChoices):
        OWNER = "owner", "صاحب قطة"
        DOCTOR = "doctor", "طبيب بيطري"

    username = None  # تعطيل اسم المستخدم
    email = models.EmailField("البريد الإلكتروني", unique=True)
    phone = models.CharField("رقم الجوال", max_length=20, blank=True)
    city = models.CharField("المدينة", max_length=80, blank=True)
    user_type = models.CharField(
        "نوع الحساب",
        max_length=10,
        choices=UserType.choices,
        default=UserType.OWNER,
    )
    is_phone_verified = models.BooleanField("تم التحقق من الجوال", default=False)
    created_at = models.DateTimeField("تاريخ الإنشاء", auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "مستخدم"
        verbose_name_plural = "المستخدمون"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_full_name() or self.email} ({self.get_user_type_display()})"


# ══════════════════════════════════════════════════════════════════
# ملف الطبيب البيطري
# ══════════════════════════════════════════════════════════════════
class DoctorProfile(models.Model):
    """
    الملف المهني للطبيب البيطري.

    يحتوي على سنة بداية العمل (work_start_year)، ويوفّر ميثود
    `experience_years` لحساب عدد سنوات الخبرة بناءً على السنة الحالية.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "قيد المراجعة"
        APPROVED = "approved", "معتمد"
        REJECTED = "rejected", "مرفوض"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="doctor_profile",
        verbose_name="المستخدم",
    )
    full_name = models.CharField("الاسم الكامل", max_length=120)
    license_number = models.CharField("رقم الترخيص المهني", max_length=60, unique=True)
    specialty = models.CharField("التخصص", max_length=120)

    # سنة بداية العمل — تُجلب من الباك اند وتُحسب منها سنوات الخبرة.
    work_start_year = models.PositiveIntegerField(
        "سنة بداية العمل",
        null=True,
        blank=True,
        help_text="السنة الميلادية التي بدأ فيها الطبيب ممارسة المهنة.",
    )

    avatar = models.ImageField(
        "الصورة الشخصية", upload_to="doctors/", null=True, blank=True
    )
    bio = models.TextField("نبذة تعريفية", blank=True)

    # حقول العرض على الصفحة الرئيسية
    rating = models.DecimalField(
        "التقييم", max_digits=2, decimal_places=1, default=0
    )
    reviews_count = models.PositiveIntegerField("عدد التقييمات", default=0)
    consultation_price = models.PositiveIntegerField(
        "سعر الاستشارة (ر.س)", default=0
    )
    is_available = models.BooleanField("متاح الآن", default=True)

    status = models.CharField(
        "حالة الحساب",
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField("تاريخ التسجيل", auto_now_add=True)

    class Meta:
        verbose_name = "ملف طبيب"
        verbose_name_plural = "ملفات الأطباء"
        ordering = ["-rating", "-created_at"]

    def __str__(self):
        return f"{self.full_name} — {self.specialty}"

    # ── الميثود المطلوبة: حساب سنوات الخبرة كرقم ─────────────────
    def experience_years(self):
        """
        تحسب عدد سنوات الخبرة كرقم = السنة الحالية − سنة بداية العمل.

        سنة بداية العمل (work_start_year) مخزّنة كما هي في الباك اند،
        وهذه الميثود تحوّلها إلى رقم سنوات الخبرة للعرض على الكارد.

        تُرجع 0 إذا لم تُحدَّد سنة البداية، ولا تُرجع قيمة سالبة
        إذا كانت سنة البداية في المستقبل.
        """
        if not self.work_start_year:
            return 0
        current_year = timezone.now().year
        return max(0, current_year - self.work_start_year)


# ══════════════════════════════════════════════════════════════════
# إعدادات الموقع العامة
# ══════════════════════════════════════════════════════════════════
class SiteSetting(models.Model):
    """
    إعدادات عامة للمنصة تُدار من لوحة التحكم.

    أهمها `platform_start_year`: سنة بداية عمل منصة رؤوف،
    وتُعرض على الصفحة الرئيسية بعد حساب عدد سنوات الخبرة منها.
    """

    platform_start_year = models.PositiveIntegerField(
        "سنة بداية عمل المنصة",
        default=2024,
        help_text="السنة الميلادية التي بدأت فيها منصة رؤوف عملها.",
    )
    doctors_count = models.PositiveIntegerField(
        "عدد الأطباء المعلن", default=120
    )
    consultations_count = models.PositiveIntegerField(
        "عدد الاستشارات الناجحة", default=5000
    )
    average_rating = models.DecimalField(
        "متوسط التقييم", max_digits=2, decimal_places=1, default=4.9
    )
    updated_at = models.DateTimeField("آخر تحديث", auto_now=True)

    class Meta:
        verbose_name = "إعداد الموقع"
        verbose_name_plural = "إعدادات الموقع"

    def __str__(self):
        return f"إعدادات المنصة (بدأت {self.platform_start_year})"

    # ── ميثود حساب سنوات عمل المنصة ──────────────────────────────
    def platform_experience_years(self):
        """
        تحسب عدد سنوات عمل المنصة = السنة الحالية − سنة البداية.

        هذه القيمة تُعرض على الصفحة الرئيسية بجانب نص الخبرة.
        """
        current_year = timezone.now().year
        return max(0, current_year - self.platform_start_year)

    @classmethod
    def get_solo(cls):
        """تُرجع سجل الإعدادات الوحيد، وتنشئه إن لم يكن موجوداً."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


# ══════════════════════════════════════════════════════════════════
# رمز التحقق OTP
# ══════════════════════════════════════════════════════════════════
class OtpCode(models.Model):
    """
    رمز تحقق لمرة واحدة يُرسل للمستخدم.

    يُستخدم في تدفقات: تسجيل صاحب القطة، تسجيل الطبيب،
    واستعادة كلمة المرور.
    """

    class Flow(models.TextChoices):
        REGISTER = "register", "تسجيل مستخدم"
        DOCTOR_REGISTER = "doctor-register", "تسجيل طبيب"
        FORGOT = "forgot", "استعادة كلمة المرور"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="otp_codes",
        verbose_name="المستخدم",
        null=True,
        blank=True,
    )
    identifier = models.CharField(
        "المعرّف (بريد/جوال)", max_length=120, db_index=True
    )
    code = models.CharField("الرمز", max_length=10)
    flow = models.CharField(
        "نوع التدفق", max_length=20, choices=Flow.choices
    )
    is_used = models.BooleanField("تم استخدامه", default=False)
    created_at = models.DateTimeField("وقت الإنشاء", auto_now_add=True)
    expires_at = models.DateTimeField("وقت الانتهاء")

    class Meta:
        verbose_name = "رمز تحقق"
        verbose_name_plural = "رموز التحقق"
        ordering = ["-created_at"]

    def __str__(self):
        return f"رمز {self.code} لـ {self.identifier} ({self.get_flow_display()})"

    def is_valid(self):
        """يتحقق أن الرمز غير مستخدم ولم تنتهِ صلاحيته."""
        return not self.is_used and timezone.now() < self.expires_at
