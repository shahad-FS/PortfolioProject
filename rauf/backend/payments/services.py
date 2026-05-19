import requests
from django.conf import settings
from requests.auth import HTTPBasicAuth

class MoyasarService:
    @staticmethod
    def verify_payment(payment_id):
        """
        التحقق من حالة العملية مباشرة من سيرفر ميسر
        """
        url = f"https://api.moyasar.com/v1/payments/{payment_id}"
        
        
        secret_key = getattr(settings, 'MOYASAR_SECRET_KEY', None)
        
        if not secret_key:
            print("secret key not found!")
            return None
        
        try:
            
            response = requests.get(url, auth=HTTPBasicAuth(secret_key, ''))
            
            
            if response.status_code == 200: 
                return response.json() 
            else:
                print(f"Moyasar API Error: {response.status_code} - {response.text}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Network error with Moyasar: {e}")
            return None