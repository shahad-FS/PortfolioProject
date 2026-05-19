from rest_framework import serializers
from .models import Consultation
from pets.models import Pet
from medical.serializers import MedicalRecordSerializer


class ConsultationSerializer(serializers.ModelSerializer):
    medical_record = MedicalRecordSerializer(read_only=True)
    
    pet_name = serializers.CharField(
        source="pet.name",
        read_only=True
    )

    vet_name = serializers.CharField(
        source="vet.profile.full_name", # 💡 تعديل اختياري: لإرجاع الاسم الكامل للطبيب بدلاً من الـ username
        read_only=True
    )

    # 🔥 إضافة حقل سعر الجلسة ديناميكياً
    session_price = serializers.SerializerMethodField()

    class Meta:
        model = Consultation

        fields = [
            "id",
            "pet",
            "pet_name",
            "vet",
            "vet_name",
            "status",
            "scheduled_at",
            "created_at",
            "medical_record",
            "session_price", # 🔥 إضافته هنا ليظهر في الـ JSON الراجع للـ React
        ]

        # هذه الحقول لا يدخلها المستخدم مباشرة
        read_only_fields = ["status", "created_at"]

    # 💡 دالة جلب السعر من ملف الطبيب المرتبط بالاستشارة
    def get_session_price(self, obj):
        if obj.vet and hasattr(obj.vet, 'vet_profile'):
            # تأكدي أن اسم الحقل في موديل الـ VetProfile هو session_price فعلاً
            return str(obj.vet.vet_profile.session_price)
        return "100.00" # سعر احتياطي افتراضي في حال لم يُحدد الطبيب سعراً

    # Validation مهم جداً قبل إنشاء الحجز
    def validate(self, data):
        """
        التحقق من صحة البيانات قبل إنشاء consultation
        """

        request = self.context.get("request")
        user = request.user

        pet = data.get("pet")
        vet = data.get("vet")

        # التأكد أن pet فعلاً تابع للـ pet_owner
        if pet.owner != user:
            raise serializers.ValidationError(
                "You can only book consultations for your own pets."
            )

        # التأكد أن vet فعلاً vet
        if vet.role != "vet":
            raise serializers.ValidationError(
                "Selected user is not a vet."
            )

        return data