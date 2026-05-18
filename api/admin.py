"""تسجيل نماذج Raouf في لوحة تحكم Django."""
from django.contrib import admin

from .models import DoctorProfile, OtpCode, SiteSetting, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "user_type", "is_phone_verified", "created_at")
    list_filter = ("user_type", "is_phone_verified", "is_staff")
    search_fields = ("email", "first_name", "last_name", "phone")


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "specialty",
        "work_start_year",
        "experience_years",
        "rating",
        "status",
    )
    list_filter = ("status", "specialty", "is_available")
    search_fields = ("full_name", "license_number", "specialty")

    @admin.display(description="سنوات الخبرة")
    def experience_years(self, obj):
        return obj.experience_years()


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = (
        "platform_start_year",
        "platform_experience_years",
        "doctors_count",
        "consultations_count",
        "average_rating",
    )

    @admin.display(description="سنوات عمل المنصة")
    def platform_experience_years(self, obj):
        return obj.platform_experience_years()


@admin.register(OtpCode)
class OtpCodeAdmin(admin.ModelAdmin):
    list_display = ("identifier", "code", "flow", "is_used", "created_at", "expires_at")
    list_filter = ("flow", "is_used")
    search_fields = ("identifier", "code")
