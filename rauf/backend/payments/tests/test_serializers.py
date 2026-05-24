from django.test import TestCase
from payments.serializers import PaymentIntentSerializer

class PaymentSerializerTests(TestCase):
    def test_invalid_amount(self):
        data = {"consultation_id": 1, "amount": 0}
        serializer = PaymentIntentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)