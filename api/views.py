"""
منطق العرض (Views) لواجهة برمجة تطبيقات Raouf.

يغطّي:
- الصفحة الرئيسية: جلب الأطباء وإعدادات الموقع (سنة بداية العمل).
- تسجيل صاحب القطة والطبيب.
- التحقق من رمز OTP وإعادة إرساله.
- تسجيل الدخول.
"""
from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import DoctorProfile, OtpCode, SiteSetting
from .serializers import (
    DoctorCardSerializer,
    DoctorRegisterSerializer,
    LoginSerializer,
    OtpRequestSerializer,
    OtpVerifySerializer,
    OwnerRegisterSerializer,
    SiteSettingSerializer,
    UserSerializer,
)
from .services import create_otp, verify_otp

User = get_user_model()


def _tokens_for(user):
    """يولّد زوج رموز JWT (access + refresh) للمستخدم."""
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


# ══════════════════════════════════════════════════════════════════
# الصفحة الرئيسية
# ══════════════════════════════════════════════════════════════════
class DoctorListView(generics.ListAPIView):
    """
    يُرجع قائمة الأطباء البيطريين المعتمدين لعرضها على الصفحة الرئيسية.

    كل طبيب يتضمّن سنوات الخبرة المحسوبة من سنة بداية عمله.
    """

    serializer_class = DoctorCardSerializer

    def get_queryset(self):
        qs = DoctorProfile.objects.filter(status=DoctorProfile.Status.APPROVED)
        # دعم الفلترة الاختيارية حسب التخصص.
        specialty = self.request.query_params.get("specialty")
        if specialty:
            qs = qs.filter(specialty__icontains=specialty)
        return qs


@api_view(["GET"])
def site_settings_view(request):
    """
    يُرجع إعدادات الموقع، وأهمها سنة بداية عمل المنصة
    وعدد سنوات الخبرة المحسوب منها لعرضه على الصفحة الرئيسية.
    """
    settings_obj = SiteSetting.get_solo()
    serializer = SiteSettingSerializer(settings_obj)
    return Response(serializer.data)


@api_view(["GET"])
def home_view(request):
    """
    نقطة نهاية مجمّعة للصفحة الرئيسية.

    تُرجع إعدادات الموقع وقائمة الأطباء في استجابة واحدة لتقليل
    عدد الطلبات من الواجهة الأمامية.
    """
    settings_obj = SiteSetting.get_solo()
    doctors = DoctorProfile.objects.filter(status=DoctorProfile.Status.APPROVED)
    return Response(
        {
            "site": SiteSettingSerializer(settings_obj).data,
            "doctors": DoctorCardSerializer(doctors, many=True).data,
        }
    )


# ══════════════════════════════════════════════════════════════════
# تسجيل صاحب قطة
# ══════════════════════════════════════════════════════════════════
class OwnerRegisterView(APIView):
    """ينشئ حساب صاحب قطة جديد ويرسل رمز تحقق."""

    def post(self, request):
        serializer = OwnerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        create_otp(
            identifier=user.email,
            flow=OtpCode.Flow.REGISTER,
            user=user,
        )
        return Response(
            {
                "message": "تم إنشاء الحساب، أرسلنا لك رمز التحقق.",
                "user": UserSerializer(user).data,
                "otp_flow": OtpCode.Flow.REGISTER,
                "otp_identifier": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


# ══════════════════════════════════════════════════════════════════
# تسجيل طبيب بيطري
# ══════════════════════════════════════════════════════════════════
class DoctorRegisterView(APIView):
    """
    ينشئ حساب طبيب بيطري جديد وملفه المهني (قيد المراجعة)،
    ثم يرسل رمز تحقق.
    """

    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        create_otp(
            identifier=user.email,
            flow=OtpCode.Flow.DOCTOR_REGISTER,
            user=user,
        )
        return Response(
            {
                "message": "تم استلام طلب التسجيل، أرسلنا لك رمز التحقق. "
                "سيُراجع طلبك خلال ٢٤–٤٨ ساعة.",
                "user": UserSerializer(user).data,
                "otp_flow": OtpCode.Flow.DOCTOR_REGISTER,
                "otp_identifier": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


# ══════════════════════════════════════════════════════════════════
# التحقق من رمز OTP
# ══════════════════════════════════════════════════════════════════
class OtpVerifyView(APIView):
    """يتحقق من رمز OTP المُدخل في صفحة التحقق."""

    def post(self, request):
        serializer = OtpVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        ok, result = verify_otp(
            identifier=data["identifier"],
            code=data["code"],
            flow=data["flow"],
        )
        if not ok:
            return Response(
                {"verified": False, "message": result},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # تفعيل المستخدم المرتبط بالرمز إن وُجد.
        otp = result
        response = {"verified": True, "message": "تم التحقق بنجاح."}
        if otp.user:
            otp.user.is_phone_verified = True
            otp.user.save(update_fields=["is_phone_verified"])
            response["user"] = UserSerializer(otp.user).data
            # في تدفقات التسجيل نعيد رموز الدخول مباشرة.
            if data["flow"] in (
                OtpCode.Flow.REGISTER,
                OtpCode.Flow.DOCTOR_REGISTER,
            ):
                response["tokens"] = _tokens_for(otp.user)

        return Response(response)


class OtpResendView(APIView):
    """يعيد إرسال رمز التحقق لمعرّف معيّن."""

    def post(self, request):
        serializer = OtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.filter(email__iexact=data["identifier"]).first()
        create_otp(
            identifier=data["identifier"],
            flow=data["flow"],
            user=user,
        )
        return Response({"message": "تم إعادة إرسال رمز التحقق."})


# ══════════════════════════════════════════════════════════════════
# تسجيل الدخول
# ══════════════════════════════════════════════════════════════════
class LoginView(APIView):
    """يتحقق من بيانات الدخول ويُرجع رموز JWT."""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = authenticate(
            request,
            username=data["email"],
            password=data["password"],
        )
        if user is None:
            return Response(
                {"message": "البريد الإلكتروني أو كلمة المرور غير صحيحة."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(
            {
                "message": "تم تسجيل الدخول بنجاح.",
                "user": UserSerializer(user).data,
                "tokens": _tokens_for(user),
            }
        )
