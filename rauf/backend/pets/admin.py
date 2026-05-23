from django.contrib import admin
from .models import Pet
from django.utils import timezone

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'name', 
        'type', 
        'breed', 
        'get_owner_email', 
        'birth_year', 
        'get_age',       
        'created_at'
    )
    
    list_filter = ('type', 'birth_year', 'created_at')
    
    search_fields = ('name', 'type', 'breed', 'owner__email')
    
    list_editable = ('type', 'breed')
    
    ordering = ('-created_at',)

    fieldsets = (
        ('Pet Identity', {
            'fields': ('name', 'type', 'breed')
        }),
        ('Ownership & Age', {
            'fields': ('owner', 'birth_year')
        }),
        ('System Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',), 
        }),
    )

    readonly_fields = ('created_at',)


    def get_owner_email(self, obj):
        return obj.owner.email if obj.owner else "No Owner"
    get_owner_email.short_description = 'Owner Email'


    def get_age(self, obj):
        if obj.birth_year:
            current_year = timezone.now().year
            age = current_year - obj.birth_year
            if age <= 0:
                return "Less than a year"
            return f"{age} Years"
        return "-"
    get_age.short_description = 'Current Age'