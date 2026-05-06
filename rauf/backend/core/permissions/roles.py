# استيراد الكلاس الأساسي للصلاحيات المبنية على الأدوار
from .base import RolePermission


class IsPetOwner(RolePermission):
    """
    صلاحية خاصة بمستخدمين pet_owner فقط
    - أي API يستخدم هذا الـ permission
    التأكدذ أن المستخدم هو pet_owner قبل السماح له بالدخول

    """

    allowed_roles = ["pet_owner"]


class IsVet(RolePermission):
    """
    صلاحية خاصة بالأطباء البيطريين (vet)
    التأكد أن المستخدم هو طبيب بيطري قبل السماح له بالدخول
    """

    allowed_roles = ["vet"]


class IsAdmin(RolePermission):
    """
    صلاحية خاصة بالأدمن (Admin)
    التأكد أن المستخدم هو أدمن قبل السماح له بالدخول
    """

    # فقط الأدمن مسموح له بالدخول
    allowed_roles = ["admin"]
