from rest_framework import serializers
from .models import MedicalRecord, Diagnosis, Prescription


class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = [
            "id",
            "record",
            "description",
            "created_at"
        ]


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = [
            "id",
            "record",
            "medication",
            "dosage",
            "instructions",
            "created_at"
        ]


class MedicalRecordSerializer(serializers.ModelSerializer):
    diagnoses = DiagnosisSerializer(many=True, read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    consultation_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            "id",
            "consultation_id",
            "notes",
            "diagnoses",
            "prescriptions",
            "created_at"
        ]

    def create(self, validated_data):
        consultation_id = validated_data.pop("consultation_id")

        medical_record = MedicalRecord.objects.create(
            consultation_id=consultation_id,
            **validated_data
        )

        return medical_record
