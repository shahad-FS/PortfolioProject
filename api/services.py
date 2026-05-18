"""
خدمة رموز التحقق (OTP).

تتولّى توليد الرموز وحفظها وإرسالها. حالياً تطبع الرمز في السجل
(محاكاة)، ويمكن لاحقاً ربطها بمزوّد رسائل SMS فعلي.
"""
import logging
import random
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from .models import OtpCode

logger = logging.getLogger(__name__)


def generate_code(length=None):
    """يولّد رمزاً رقمياً عشوائياً بالطول المحدّد."""
    length = length or settings.OTP_LENGTH
    lower = 10 ** (length - 1)
    upper = (10 ** length) - 1
    return str(random.randint(lower, upper))


def create_otp(identifier, flow, user=None):
    """
    ينشئ رمز تحقق جديد لمعرّف معيّن ويبطل الرموز السابقة غير المستخدمة.

    يُرجع كائن OtpCode.
    """
    # إبطال أي رموز سابقة لنفس المعرّف والتدفق.
    OtpCode.objects.filter(
        identifier=identifier, flow=flow, is_used=False
    ).update(is_used=True)

    code = generate_code()
    expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    otp = OtpCode.objects.create(
        user=user,
        identifier=identifier,
        code=code,
        flow=flow,
        expires_at=expires_at,
    )
    _send_otp(identifier, code)
    return otp


def _send_otp(identifier, code):
    """
    يرسل الرمز للمستخدم.

    محاكاة حالياً عبر السجل؛ يُستبدل لاحقاً بمزوّد SMS/بريد فعلي.
    """
    logger.info("إرسال رمز التحقق %s إلى %s", code, identifier)


def verify_otp(identifier, code, flow):
    """
    يتحقق من رمز التحقق.

    يُرجع (True, otp) عند النجاح، أو (False, رسالة الخطأ) عند الفشل.
    """
    otp = (
        OtpCode.objects.filter(identifier=identifier, flow=flow, code=code)
        .order_by("-created_at")
        .first()
    )
    if otp is None:
        return False, "الرمز الذي أدخلته غير صحيح."
    if otp.is_used:
        return False, "هذا الرمز استُخدم مسبقاً."
    if timezone.now() >= otp.expires_at:
        return False, "انتهت صلاحية الرمز، اطلب رمزاً جديداً."

    otp.is_used = True
    otp.save(update_fields=["is_used"])
    return True, otp
