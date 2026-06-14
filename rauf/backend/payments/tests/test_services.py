from django.test import TestCase
from unittest.mock import patch
from payments.services import MoyasarService

class MoyasarServiceTests(TestCase):
    @patch('payments.services.requests.get')
    def test_verify_payment_success(self, mock_get):
     
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"id": "pay_123", "status": "paid"}
        
        result = MoyasarService.verify_payment("pay_123")
        self.assertEqual(result['status'], 'paid')

    @patch('payments.services.requests.get')
    def test_verify_payment_failed(self, mock_get):
        mock_get.return_value.status_code = 404
        
        result = MoyasarService.verify_payment("invalid_id")
        self.assertIsNone(result)