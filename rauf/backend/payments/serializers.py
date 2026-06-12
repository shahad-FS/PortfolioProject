from rest_framework import serializers
from .models import PaymentTransaction

class PaymentIntentSerializer(serializers.ModelSerializer):
    consultation_id = serializers.IntegerField(required=True)
    class Meta:
        model = PaymentTransaction
        fields = ['id', 'amount', 'currency', 'status', 'consultation_id']
        read_only_fields = ['id', 'currency', 'status']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount should be more than 0")
        return value


class PaymentVerificationSerializer(serializers.Serializer):
    payment_id = serializers.CharField(required=True, max_length=100)
    transaction_id = serializers.IntegerField(required=False, allow_null=True)