from django.contrib import admin
from .models import Consultation

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'get_owner_email', 
        'get_pet_name', 
        'get_vet_email', 
        'scheduled_at', 
        'status', 
        'session_price', 
        'is_paid'
    )
    
    list_filter = ('status', 'is_paid', 'scheduled_at', 'created_at')
    
    search_fields = ('owner__email', 'vet__email', 'pet__name')
    
    list_editable = ('status', 'is_paid')
    
    ordering = ('-scheduled_at',)

    fieldsets = (
        ('Core Parties', {
            'fields': ('owner', 'pet', 'vet')
        }),
        ('Scheduling & Status', {
            'fields': ('scheduled_at', 'status')
        }),
        ('Financial Details', {
            'fields': ('session_price', 'is_paid')
        }),
        ('System Logs', {
            'fields': ('created_at',),
            'classes': ('collapse',), 
        }),
    )

    readonly_fields = ('created_at',)

    
    def get_owner_email(self, obj):
        return obj.owner.email if obj.owner else "No Owner"
    get_owner_email.short_description = 'Owner Email'

    def get_pet_name(self, obj):
        return obj.pet.name if obj.pet else "No Pet"
    get_pet_name.short_description = 'Pet Name'

    def get_vet_email(self, obj):
        return obj.vet.email if obj.vet else "No Vet"
    get_vet_email.short_description = 'Vet Email'