import logging
import requests
from django.conf import settings
from requests.auth import HTTPBasicAuth


logger = logging.getLogger(__name__)
class MoyasarService:
    @staticmethod
    def verify_payment(payment_id):
        
        url = f"https://api.moyasar.com/v1/payments/{payment_id}"
        
        
        secret_key = getattr(settings, 'MOYASAR_SECRET_KEY', None)
        
        if not secret_key:
            logger.error("Moyasar: Secret key is missing!")
            return None
        
        try:
            
            response = requests.get(url, auth=HTTPBasicAuth(secret_key, ''), timeout=10)
            
            
            if response.status_code == 200: 
                return response.json() 
            else:
                logger.error(f"Moyasar API Error: {response.status_code} - {response.text}")
                return None
        except requests.exceptions.RequestException as e:
            logger.exception(f"Network error with Moyasar: {e}")
            return None