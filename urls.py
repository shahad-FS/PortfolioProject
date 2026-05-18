"""توجيهات URL لواجهة برمجة تطبيقات Raouf."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views  # تم تصحيح السطر هنا ليكون استدعاءً قياسياً صحيحاً

app_name = "api"

urlpatterns = [
    # ── الصفحة الرئيسية ──────────────────────────────────────────
    path("home/", views.home_view, name="home"),
    path("doctors/", views.DoctorListView.as_view(), name="doctors"),
    path("site-settings/", views.site_settings_view, name="site-settings"),
    # ── التسجيل ──────────────────────────────────────────────────
    path("register/owner/", views.OwnerRegisterView.as_view(), name="register-owner"),
    path("register/doctor/", views.DoctorRegisterView.as_view(), name="register-doctor"),
    # ── التحقق OTP ───────────────────────────────────────────────
    path("otp/verify/", views.OtpVerifyView.as_view(), name="otp-verify"),
    path("otp/resend/", views.OtpResendView.as_view(), name="otp-resend"),
    # ── تسجيل الدخول ─────────────────────────────────────────────
    path("login/", views.LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
