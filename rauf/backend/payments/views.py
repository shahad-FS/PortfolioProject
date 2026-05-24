from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import PaymentTransaction
from .serializers import PaymentIntentSerializer, PaymentVerificationSerializer
from .services import MoyasarService
from consultations.models import Consultation  

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentIntentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        consultation_id = serializer.validated_data['consultation_id']

        try:

            consultation = Consultation.objects.get(id=consultation_id, owner=request.user)
            
            final_price = consultation.session_price
            
        except Consultation.DoesNotExist:
            return Response({"error": "session not found"}, status=status.HTTP_404_NOT_FOUND)

        
        transaction = PaymentTransaction.objects.create(
            owner=request.user,
            consultation=consultation,
            amount=final_price,
            status='initiated'
        )
            
        return Response({
            "transaction_id": transaction.id,
            "amount": transaction.amount
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payment_id = serializer.validated_data['payment_id']
        transaction_id = serializer.validated_data['transaction_id']

        try:
            transaction = PaymentTransaction.objects.get(id=transaction_id, owner=request.user)
        except PaymentTransaction.DoesNotExist:
            return Response({"error": "not exist"}, status=status.HTTP_404_NOT_FOUND)

        
        moyasar_data = MoyasarService.verify_payment(payment_id)

        if moyasar_data and moyasar_data.get('status') == 'paid':
            
            transaction.moyasar_payment_id = payment_id
            transaction.status = 'paid'
            transaction.save()

           
            consultation = transaction.consultation
            consultation.is_paid = True
            consultation.save()

            return Response({"status": "success", "message": "payment viarefied"}, status=status.HTTP_200_OK)
        
        else:
            transaction.status = 'failed'
            transaction.save()
            return Response({"status": "failed", "message": "faild"}, status=status.HTTP_400_BAD_REQUEST)