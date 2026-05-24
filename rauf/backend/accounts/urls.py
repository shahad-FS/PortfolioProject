from django.urls import path
from .views import RegisterView, UserProfileView, VerifyEmailView, LoginView, LogoutView, VetListView, VetDetailView, VetProfileUpdateView, CustomTokenRefreshView


urlpatterns = [

    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view()),
    path("verify-email/<uuid:token>/", VerifyEmailView.as_view()),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("vets/", VetListView.as_view(), name="vet-list"),
    path("vets/<int:pk>/", VetDetailView.as_view(), name="vet-detail"),
    path("vet/profile/", VetProfileUpdateView.as_view(), name="vet-profile"),
    path("token/refresh", CustomTokenRefreshView.as_view(), name="token-refresh")
]
