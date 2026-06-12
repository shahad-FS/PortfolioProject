from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import PaymentTransaction
from .serializers import PaymentIntentSerializer, PaymentVerificationSerializer
from .services import MoyasarService
from consultations.models import Consultation
from core.services.email_service import EmailService
import logging
import re
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

logger = logging.getLogger(__name__)

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
        transaction_id = serializer.validated_data.get('transaction_id')

        moyasar_data = MoyasarService.verify_payment(payment_id)
        if not moyasar_data or moyasar_data.get('status') != 'paid':
            return Response({"status": "failed", "message": "Payment not paid on Moyasar"}, status=status.HTTP_400_BAD_REQUEST)

        transaction = None
        if transaction_id:
            try:
                transaction = PaymentTransaction.objects.get(id=transaction_id, owner=request.user)
            except PaymentTransaction.DoesNotExist:
                pass


        if not transaction:
            description = moyasar_data.get('description', '') 
            match = re.search(r'#(\d+)', description)
            
            if match:
                consultation_id = match.group(1)
                transaction = PaymentTransaction.objects.filter(
                    consultation_id=consultation_id, 
                    owner=request.user
                ).order_by('-created_at').first()

        if not transaction:
            description = moyasar_data.get('description', '')
            match = re.search(r'#(\d+)', description)
            if match:
                try:
                    consultation = Consultation.objects.get(id=match.group(1), owner=request.user)
                    amount_in_riyal = float(moyasar_data.get('amount', 0)) / 100.0
                    
                    transaction = PaymentTransaction.objects.create(
                        owner=request.user,
                        consultation=consultation,
                        amount=amount_in_riyal,
                        status='initiated'
                    )
                except Consultation.DoesNotExist:
                    return Response({"error": "Consultation not found for this payment description"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Transaction not found and description cannot be parsed"}, status=status.HTTP_404_NOT_FOUND)

        transaction.moyasar_payment_id = payment_id
        transaction.status = 'paid'
        transaction.save()

        consultation = transaction.consultation
        consultation.is_paid = True
        consultation.save()

        try:
            EmailService.send_consultation_confirmation(transaction.owner, consultation)
            EmailService.send_vet_notification(consultation.vet, consultation)
        except Exception as e:
            logger.error(f"Email notification failed after payment for consultation {consultation.id}: {e}")

        return Response({"status": "success", "message": "payment verified and emails sent"}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class MoyasarWebhookView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        payload = request.data
        
        incoming_token = payload.get('secret_token')
        expected_token = getattr(settings, 'MOYASAR_WEBHOOK_SECRET', None)
        
        if not expected_token or incoming_token != expected_token:
            logger.warning("Moyasar Webhook: Unauthorized access attempt or missing secret token.")
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        event_type = payload.get('type')
        
        if event_type == 'payment_paid':
            payment_data = payload.get('data', {})
            payment_id = payment_data.get('id')
            payment_status = payment_data.get('status')
            description = payment_data.get('description', '')

            if payment_status == 'paid' and payment_id:
                match = re.search(r'#(\d+)', description)
                if match:
                    consultation_id = match.group(1)
                    
                    try:
                        transaction = PaymentTransaction.objects.filter(
                            consultation_id=consultation_id
                        ).order_by('-created_at').first()

                        if transaction:
                            if transaction.status != 'paid':
                                transaction.moyasar_payment_id = payment_id
                                transaction.status = 'paid'
                                transaction.save()

                                consultation = transaction.consultation
                                consultation.is_paid = True
                                consultation.save()

                                try:
                                    EmailService.send_consultation_confirmation(transaction.owner, consultation)
                                    EmailService.send_vet_notification(consultation.vet, consultation)
                                except Exception as e:
                                    logger.error(f"Webhook Email failed for consultation {consultation.id}: {e}")
                                
                                logger.info(f"Webhook successfully processed payment {payment_id} for consultation {consultation_id}")
                        else:
                            logger.error(f"Webhook Error: PaymentTransaction not found for consultation #{consultation_id}")
                            
                    except Exception as e:
                        logger.error(f"Error executing webhook core logic: {e}")
        
        return Response({"status": "received"}, status=status.HTTP_200_OK)