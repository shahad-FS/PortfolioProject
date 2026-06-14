from django.contrib import admin
from .models import PaymentTransaction

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'get_owner_email', 
        'get_consultation_id', 
        'moyasar_payment_id', 
        'amount_display', 
        'status', 
        'created_at'
    )
    
    list_filter = ('status', 'currency', 'created_at', 'updated_at')
    
    search_fields = ('moyasar_payment_id', 'owner__email', 'consultation__id')
    
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Transaction Parties', {
            'fields': ('owner', 'consultation')
        }),
        ('Gateway Details (Moyasar)', {
            'fields': ('moyasar_payment_id', 'amount', 'currency')
        }),
        ('Status & Logs', {
            'fields': ('status', 'created_at', 'updated_at')
        }),
    )

    
    readonly_fields = ('owner', 'consultation', 'moyasar_payment_id', 'amount', 'currency', 'status', 'created_at', 'updated_at')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    
    def get_owner_email(self, obj):
        return obj.owner.email if obj.owner else "-"
    get_owner_email.short_description = 'Customer Email'

    def get_consultation_id(self, obj):
        return f"Consultation #{obj.consultation.id}" if obj.consultation else "-"
    get_consultation_id.short_description = 'Consultation'

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = 'Amount'