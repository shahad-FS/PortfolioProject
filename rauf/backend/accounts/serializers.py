from .models import User, VetProfile
from rest_framework import serializers
from .models import User, Profile, PetOwnerProfile, VetProfile


# Serializer لتحويل بيانات المستخدم بين JSON و Python objects
# استقبال بيانات تسجيل المستخدم و التحقق منها ثم انشاء المستخدم
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        # تحديد model المرتبط ب Serializer
        model = User
        # الحقول المسموح استقبالها من المستخدم
        fields = ["email", "password", "role"]

    def validate_email(self, value):
        # تحقق هل الإيميل مستخدم مسبقًا
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        # يرجع الايميل اذا اجتاز الفحص
        return value

    # التحقق من صحة الدور (role) الذي يختاره المستخدم
    def validate_role(self, value):
        allowed_roles = ["pet_owner", "vet", "admin"]
        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role selected")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "pet_owner"),
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["full_name", "phone"]


class PetOwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwnerProfile
        fields = []


class VetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VetProfile
        fields = ["license_number", "specialization", "session_price"]
        read_only_fields = ["is_approved"]


class UserProfileSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(read_only=True)
    pet_owner = PetOwnerProfileSerializer(
        source="petownerprofile",
        read_only=True
    )

    vet = VetProfileSerializer(
        source="vetprofile",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "role",
            "profile",
            "pet_owner",
            "vet",
        ]


class VetListSerializer(serializers.ModelSerializer):

    specialization = serializers.CharField(
        source="vetprofile.specialization",
        read_only=True
    )

    # is_approved = serializers.BooleanField(
    #     source="vetprofile.is_approved",
    #     read_only=True
    # )

    full_name = serializers.CharField(
        source="profile.full_name",
        read_only=True
    )

    session_price = serializers.FloatField(
        source = "vetprofile.session_price"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "specialization",
            # "is_approved",
            "full_name",
            "session_price",
        ]


# class VetProfileSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = VetProfile
#         fields = [
#             "license_number",
#             "specialization",
#             "is_approved"
#         ]
