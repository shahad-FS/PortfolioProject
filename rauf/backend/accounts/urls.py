from django.urls import path
from .views import RegisterView, UserProfileView, VerifyEmailView, LoginView, LogoutView

urlpatterns = [
    # endpoint لتسجيل المستخدم
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view()),
    path("verify-email/<uuid:token>/", VerifyEmailView.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]