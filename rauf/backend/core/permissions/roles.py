# استيراد الكلاس الأساسي للصلاحيات المبنية على الأدوار
from .base import RolePermission


class IsPetOwner(RolePermission):
    """
    صلاحية خاصة بمستخدمين pet_owner فقط
 

    """

    allowed_roles = ["pet_owner"]


class IsVet(RolePermission):
    """
    صلاحية خاصة بالأطباء البيطريين (vet)
    التأكد أن المستخدم هو طبيب 
    """

    allowed_roles = ["vet"]


class IsAdmin(RolePermission):
    """
    صلاحية خاصة بالأدمن (Admin)
    التأكد أن المستخدم هو أدمن
    """

    allowed_roles = ["admin"]


class IsVetOrPetOwner(RolePermission):
    allowed_roles = ["vet", "pet_owner"]


class IsConsultationVet(IsVet): 
    def has_object_permission(self, request, view, obj):
        # obj هنا هو الـ MedicalRecord
        return obj.consultation.vet == request.user