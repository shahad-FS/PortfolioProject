from rest_framework.permissions import BasePermission


class RolePermission(BasePermission):
    """
    هذا كلاس أساسي (Base Permission) مبني على نظام الأدوار (RBAC)

    الفكرة:
    بدل ما نكتب نفس منطق التحقق في كل Permission (vet, pet_owner, admin)
    نسوي كلاس واحد عام، وكل كلاس ثاني يرث منه ويحدد الأدوار المسموحة له
    """

    # قائمة الأدوار المسموح لها بالدخول لهذا الـ permission
    # يتم تحديدها في الكلاسات التي ترث من هذا الكلاس
    allowed_roles = []

    def has_permission(self, request, view):


        return (
            # الشرط الأول:
            # لازم المستخدم يكون مسجل دخول (Authenticated)
            request.user.is_authenticated and

            # الشرط الثاني:
            # role حق المستخدم لازم يكون موجود داخل قائمة الأدوار المسموح بها
            request.user.role in self.allowed_roles
        )


# هذا كلاس خاص للتحقق من ملكية الكائن (Object-level Permission)
# هل المستخدم هو صاحب هذا الكائن (مثل حيوان معين أو تقرير طبي معين)
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user



class IsConsultationVet(BasePermission):
    def has_permission(self, request, view):
        # في حال الـ Create، نتأكد أن الطبيب هو صاحب الاستشارة
        if request.method == 'POST':
            consultation_id = request.data.get('consultation_id') or request.data.get('record')
            # يمكنك هنا إضافة منطق للتحقق من أن request.user هو الطبيب المعالج
        return True