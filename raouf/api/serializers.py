"""
المُسلسلات (Serializers) لمنصة Raouf.

تحوّل نماذج Django إلى/من JSON لتبادلها مع الواجهة الأمامية.
"""
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from .models import DoctorProfile, OtpCode, SiteSetting

User = get_user_model()


# ══════════════════════════════════════════════════════════════════
# الطبيب البيطري — للعرض على الصفحة الرئيسية
# ══════════════════════════════════════════════════════════════════
class DoctorCardSerializer(serializers.ModelSerializer):
    """
    يُسلسل بيانات الطبيب لعرضها على كروت الصفحة الرئيسية.

    سنة بداية العمل تُخزَّن كما هي في الباك اند، ويُضاف حقل محسوب:
    - experience_years: عدد سنوات الخبرة كرقم فقط (يحسبه النموذج).
    """

    experience_years = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            "id",
            "full_name",
            "specialty",
            "work_start_year",
            "experience_years",
            "rating",
            "reviews_count",
            "consultation_price",
            "is_available",
            "avatar",
        ]

    def get_experience_years(self, obj):
        # تستدعي الميثود المعرّفة في النموذج — تُرجع رقماً صحيحاً فقط.
        return obj.experience_years()


# ══════════════════════════════════════════════════════════════════
# إعدادات الموقع — تشمل سنة بداية العمل
# ══════════════════════════════════════════════════════════════════
class SiteSettingSerializer(serializers.ModelSerializer):
    """
    يُسلسل إعدادات الموقع للصفحة الرئيسية.

    يضيف `platform_experience_years`: عدد سنوات عمل المنصة المحسوب
    من سنة البداية، ليُعرض بجانب نص الخبرة.
    """

    platform_experience_years = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = [
            "platform_start_year",
            "platform_experience_years",
            "doctors_count",
            "consultations_count",
            "average_rating",
        ]

    def get_platform_experience_years(self, obj):
        return obj.platform_experience_years()


# ══════════════════════════════════════════════════════════════════
# تسجيل صاحب قطة
# ══════════════════════════════════════════════════════════════════
class OwnerRegisterSerializer(serializers.Serializer):
    """يتحقق من بيانات تسجيل صاحب قطة جديد وينشئ المستخدم."""

    first_name = serializers.CharField(max_length=80)
    last_name = serializers.CharField(max_length=80)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    city = serializers.CharField(max_length=80, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("هذا البريد الإلكتروني مسجّل مسبقاً.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone=validated_data["phone"],
            city=validated_data.get("city", ""),
            user_type=User.UserType.OWNER,
        )


# ══════════════════════════════════════════════════════════════════
# تسجيل طبيب بيطري
# ══════════════════════════════════════════════════════════════════
class DoctorRegisterSerializer(serializers.Serializer):
    """
    يتحقق من بيانات تسجيل طبيب بيطري جديد.

    ينشئ المستخدم وملف الطبيب المرتبط به (بحالة «قيد المراجعة»).
    """

    name = serializers.CharField(max_length=120)
    license_number = serializers.CharField(max_length=60)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    specialty = serializers.CharField(max_length=120)
    # سنة بداية العمل — اختيارية، تُحسب منها سنوات الخبرة لاحقاً.
    work_start_year = serializers.IntegerField(
        required=False, allow_null=True, min_value=1950
    )
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("هذا البريد الإلكتروني مسجّل مسبقاً.")
        return value.lower()

    def validate_license_number(self, value):
        if DoctorProfile.objects.filter(license_number__iexact=value).exists():
            raise serializers.ValidationError("رقم الترخيص هذا مسجّل مسبقاً.")
        return value

    def validate_work_start_year(self, value):
        if value and value > timezone.now().year:
            raise serializers.ValidationError(
                "سنة بداية العمل لا يمكن أن تكون في المستقبل."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data["phone"],
            user_type=User.UserType.DOCTOR,
        )
        DoctorProfile.objects.create(
            user=user,
            full_name=validated_data["name"],
            license_number=validated_data["license_number"],
            specialty=validated_data["specialty"],
            work_start_year=validated_data.get("work_start_year"),
            status=DoctorProfile.Status.PENDING,
        )
        return user


# ══════════════════════════════════════════════════════════════════
# التحقق من رمز OTP
# ══════════════════════════════════════════════════════════════════
class OtpVerifySerializer(serializers.Serializer):
    """يتحقق من رمز التحقق المرسل."""

    identifier = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=10)
    flow = serializers.ChoiceField(choices=OtpCode.Flow.choices)


class OtpRequestSerializer(serializers.Serializer):
    """يطلب إرسال (أو إعادة إرسال) رمز تحقق."""

    identifier = serializers.CharField(max_length=120)
    flow = serializers.ChoiceField(choices=OtpCode.Flow.choices)


# ══════════════════════════════════════════════════════════════════
# تسجيل الدخول
# ══════════════════════════════════════════════════════════════════
class LoginSerializer(serializers.Serializer):
    """يتحقق من بيانات تسجيل الدخول."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# ══════════════════════════════════════════════════════════════════
# بيانات المستخدم العامة
# ══════════════════════════════════════════════════════════════════
class UserSerializer(serializers.ModelSerializer):
    """يُسلسل بيانات المستخدم لإرجاعها بعد الدخول/التسجيل."""

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "city",
            "user_type",
            "is_phone_verified",
        ]
