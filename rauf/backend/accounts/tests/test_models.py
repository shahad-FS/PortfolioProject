from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from accounts.models import EmailVerificationToken
from django.core.exceptions import ValidationError
from accounts.models import VetProfile
from decimal import Decimal

User = get_user_model()

class AccountsModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """
        اختبار تسجيل مستخدم جديد
        """
        email = "petowner.test@rauf.com"
        password = "Password123!"
        user = User.objects.create_user(email=email, password=password, role="pet_owner")

        self.assertEqual(user.email, email)
        self.assertEqual(user.role, "pet_owner")
        
        self.assertTrue(user.check_password(password))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser_successful(self):
        """
        اختبار تسجيل ادمن
        """
        email = "admin.test@rauf.com"
        password = "AdminPassword123!"
        superuser = User.objects.create_superuser(email=email, password=password)

        self.assertEqual(superuser.email, email)
        self.assertEqual(superuser.role, "admin")  
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_user_without_email_raises_error(self):
        """
        اختبار التاكيد ان المستخدم مايقدر يسحل بدون ايميل
        """
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(email="", password="Password123!")
        
        self.assertEqual(str(context.exception), "Email is required")

    def test_create_user_without_password_raises_error(self):
        """
        اختبار ام السمتخدم لازم يستخدم كلمة مرور
        """
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(email="test@rauf.com", password="")
        
        self.assertEqual(str(context.exception), "Password is required")

    def test_email_verification_token_expiry(self):
        """
        اختبار اكسبايرد التوكن
        """
        user = User.objects.create_user(email="token.test@rauf.com", password="Password123!")
        token_obj = EmailVerificationToken.objects.create(user=user)

        
        self.assertFalse(token_obj.is_expired())

        
        token_obj.expires_at = timezone.now() - timedelta(hours=25)
        token_obj.save()

        
        self.assertTrue(token_obj.is_expired())




User = get_user_model()

class VetProfileModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email="vet@rauf.com", password="password123", role="vet")

    def test_session_price_must_be_greater_than_zero(self):
        """اختبار رفض سعر الجلسه اقل نم صفر"""        
        
        profile_zero = VetProfile(user=self.user, session_price=Decimal('0.00'))
        with self.assertRaises(ValidationError):
            profile_zero.full_clean()  

        
        profile_negative = VetProfile(user=self.user, session_price=Decimal('-10.00'))
        with self.assertRaises(ValidationError):
            profile_negative.full_clean()

    def test_session_price_valid(self):
        """اختبار السعر الصحيح"""
        
        profile = VetProfile.objects.get(user=self.user)
        profile.session_price = Decimal('150.00')
        
        try:
            profile.full_clean()  
            profile.save()        
        except ValidationError:
            self.fail("VetProfile raised ValidationError unexpectedly!")


            