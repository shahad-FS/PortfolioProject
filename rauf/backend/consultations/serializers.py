from datetime import datetime
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

    pet_age = serializers.SerializerMethodField()


    vet_name = serializers.CharField(
        source="vet.profile.full_name", 
        read_only=True
    )


    session_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True)

    class Meta:
        model = Consultation

        fields = [
            "id",
            "pet",
            "pet_name",
            'pet_age',
            "vet",
            "vet_name",
            "status",
            "scheduled_at",
            "created_at",
            "medical_record",
            "session_price",
            "is_paid"

        ]

        read_only_fields = ["status", "created_at"]

    
    def validate(self, data):
        """
        التحقق من صحة البيانات قبل إنشاء consultation
        """

        request = self.context.get("request")
        user = request.user

        pet = data.get("pet")
        vet = data.get("vet")

        if pet.owner != user:
            raise serializers.ValidationError(
                "You can only book consultations for your own pets."
            )

        if vet.role != "vet":
            raise serializers.ValidationError(
                "Selected user is not a vet."
            )
        return data

    def get_pet_age(self, obj):
        if obj.pet and obj.pet.birth_year:
            current_year = datetime.now().year
            return current_year - obj.pet.birth_year
        return None
