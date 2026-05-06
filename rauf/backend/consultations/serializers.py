from rest_framework import serializers
from .models import Consultation
from pets.models import Pet


class ConsultationSerializer(serializers.ModelSerializer):
    """
    Serializer خاص بحجز الاستشارات (Consultations)

    الفكرة:
    - Pet Owner يحجز Consultation
    - يختار Vet + Pet + وقت الموعد
    """

    class Meta:
        model = Consultation

        fields = [
            "id",
            "pet",
            "vet",
            "status",
            "scheduled_at",
            "created_at"
        ]

        # هذه الحقول لا يدخلها المستخدم مباشرة
        read_only_fields = ["status", "created_at"]

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
