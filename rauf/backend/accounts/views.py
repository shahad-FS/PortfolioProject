from django.shortcuts import redirect, render
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from .models import User, VetProfile, EmailVerificationToken

from django.contrib.auth import authenticate

from .serializers import VetListSerializer, RegisterSerializer, LoginSerializer, VetProfileSerializer, ProfileSerializer, PetOwnerProfileSerializer, UserProfileSerializer
from core.services.email_service import EmailService
from drf_spectacular.utils import extend_schema
from django.conf import settings
# Create your views here.


@extend_schema(
    request=RegisterSerializer,
    responses={201: {"message": "User created"}}
)
class RegisterView(APIView):
    # هذا الـ endpoint مسؤول عن تسجيل المستخدم

    def post(self, request):

        # تمرير البيانات للـ serializer للتحقق منها
        serializer = RegisterSerializer(data=request.data)

        # التحقق من صحة البيانات (email, password, role)
        if serializer.is_valid():

            # إنشاء المستخدم (باستخدام create داخل serializer)
            user = serializer.save()

            # التأكد أن المستخدم غير مفعل إلى أن يحقق الإيميل
            user.is_verified = False
            user.save()

            # إنشاء token للتحقق من الإيميل
            token_obj = EmailVerificationToken.objects.create(user=user)
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{token_obj.token}"
            # إرسال إيميل التحقق
            EmailService.send_verification_email(user, verification_url)

            # إرجاع رسالة نجاح
            return Response(
                {"message": "User created. Check your email to verify your account."},
                status=status.HTTP_201_CREATED
            )

        # إذا البيانات غير صحيحة يرجع الأخطاء
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class VerifyEmailView(APIView):
    def get(self, request, token):
        try:
            token_obj = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        if token_obj.is_used:
            return Response({"error": "Token already used"}, status=status.HTTP_400_BAD_REQUEST)

        user = token_obj.user
        user.is_verified = True
        user.is_active = True
        user.save()

        token_obj.is_used = True
        token_obj.save()

        # إرجاع نجاح، والـ React هو من سيعرض صفحة النجاح
        return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)



@extend_schema(request=LoginSerializer)
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=400)
        
        if not user.is_verified:
            return Response({"error": "Please verify your email before logging in."}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh = request.data.get("refresh")
            token = RefreshToken(refresh)
            token.blacklist()
            return Response({"message": "Logged out"})
        except Exception as e:
            return Response({"error": "Invalid token or already blacklisted"}, status=400)

@extend_schema(request=UserProfileSerializer)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(request.user)

        return Response(serializer.data)

    def patch(self, request):
        user = request.user

        profile_serializer = ProfileSerializer(
            user.profile,
            data=request.data.get("profile", {}),
            partial=True
        )

        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()

        if hasattr(user, "vetprofile"):

            vet_serializer = VetProfileSerializer(
                user.vetprofile,
                data=request.data.get("vet", {}),
                partial=True
            )

            vet_serializer.is_valid(raise_exception=True)
            vet_serializer.save()

        updated_serializer = UserProfileSerializer(user)

        return Response(
            updated_serializer.data,
            status=status.HTTP_200_OK
        )


class VetListView(ListAPIView):
    """
    API يعرض جميع الأطباء البيطريين
    يستخدمه الـ Pet Owner عند الحجز
    """

    serializer_class = VetListSerializer

    def get_queryset(self):
        """
        نرجع فقط المستخدمين الذين:
        - role = vet
        - is_verified = True
        """

        return User.objects.filter(
            role="vet",
            is_verified=True
        ).select_related("vetprofile")


class VetDetailView(RetrieveAPIView):
    """
    عرض تفاصيل طبيب واحد
    """

    queryset = User.objects.filter(role="vet")
    serializer_class = VetListSerializer


class VetProfileUpdateView(RetrieveUpdateAPIView):
    """
    الطبيب يعدل بياناته
    """

    serializer_class = VetProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        نجيب VetProfile الخاص بالمستخدم الحالي
        """

        return VetProfile.objects.get(user=self.request.user)


class CustomTokenRefreshView(TokenRefreshView):
    pass