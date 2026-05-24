from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, VetProfile, PetOwnerProfile, EmailVerificationToken

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'General Profile Info'

class VetProfileInline(admin.StackedInline):
    model = VetProfile
    can_delete = False
    verbose_name_plural = 'Veterinarian Details'

class PetOwnerProfileInline(admin.StackedInline):
    model = PetOwnerProfile
    can_delete = False
    verbose_name_plural = 'Pet Owner Details'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, VetProfileInline, PetOwnerProfileInline)
    
    list_display = ('id', 'email', 'get_full_name', 'role', 'is_active', 'is_verified', 'is_staff', 'created_at')
    
    list_filter = ('role', 'is_active', 'is_verified', 'is_staff', 'created_at')
    
    search_fields = ('email', 'profile__full_name', 'profile__phone')
    
    ordering = ('-created_at',)
    
    list_editable = ('is_active', 'is_verified', 'role')

    fieldsets = (
        ('Account Credentials', {'fields': ('email', 'password')}),
        ('Permissions & Roles', {'fields': ('role', 'is_active', 'is_verified', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'role', 'is_active', 'is_verified'),
        }),
    )

    def get_full_name(self, obj):
        try:
            return obj.profile.full_name if obj.profile.full_name else "No Name Set"
        except Profile.DoesNotExist:
            return "No Profile"
    get_full_name.short_description = 'Full Name'


@admin.register(VetProfile)
class VetProfileAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'license_number', 'specialization', 'session_price', 'is_approved')
    list_filter = ('is_approved', 'specialization')
    search_fields = ('user__email', 'license_number', 'specialization')
    list_editable = ('is_approved', 'session_price')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Vet Email'


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'is_used', 'created_at', 'expires_at', 'check_expired')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'token')

    def check_expired(self, obj):
        return obj.is_expired()
    check_expired.boolean = True  
    check_expired.short_description = 'Is Expired?'