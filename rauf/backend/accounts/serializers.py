from rest_framework import serializers
from .models import User, Profile, PetOwnerProfile, VetProfile


# Serializer لتحويل بيانات المستخدم بين JSON و Python objects
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        # تحديد model المرتبط ب Serializer
        model = User
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
        fields = ["license_number", "specialization", "session_price", "is_approved", "bio"]
        read_only_fields = ["is_approved"]
    
    def validate_session_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("session_price should be grater than zero.")
        return value

    def update(self, instance, validated_data):
        print("DEBUG: Serializer received bio:", validated_data.get('bio'))
        return super().update(instance, validated_data)

class UserProfileSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(required=False)
    pet_owner = PetOwnerProfileSerializer(
        source="petownerprofile",
        required=False 
    )
    vet = VetProfileSerializer(
        source="vetprofile",
        required=False
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

    def update(self, instance, validated_data):
       
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        
        profile_data = validated_data.get('profile', {})
        if profile_data: 
            profile = instance.profile
            profile.full_name = profile_data.get('full_name', profile.full_name)
            profile.phone = profile_data.get('phone', profile.phone)
            profile.save()

        
        vet_data = validated_data.get('vetprofile') 
        if vet_data and hasattr(instance, 'vetprofile'):
            vet_profile = instance.vetprofile
            for attr, value in vet_data.items():
                setattr(vet_profile, attr, value)
            vet_profile.save()

        return instance


class VetListSerializer(serializers.ModelSerializer):

    specialization = serializers.CharField(
        source="vetprofile.specialization",
        read_only=True
    )

    is_approved = serializers.BooleanField(
        source="vetprofile.is_approved",
        read_only=True
    )

    full_name = serializers.CharField(
        source="profile.full_name",
        read_only=True
    )

    session_price = serializers.FloatField(
        source = "vetprofile.session_price"
    )

    bio = serializers.CharField(
        source = "vetprofile.bio"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "specialization",
            "is_approved",
            "full_name",
            "session_price",
            "bio"
        ]


# class VetProfileSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = VetProfile
#         fields = [
#             "license_number",
#             "specialization",
#             "is_approved"
#         ]
