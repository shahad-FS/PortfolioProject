from django.contrib import admin
from .models import MedicalRecord, Diagnosis, Prescription

class DiagnosisInline(admin.TabularInline):
    model = Diagnosis
    extra = 1 
    fields = ('description', 'created_at')
    readonly_fields = ('created_at',)

class PrescriptionInline(admin.TabularInline):
    model = Prescription
    extra = 1 
    fields = ('medication', 'dosage', 'instructions', 'created_at')
    readonly_fields = ('created_at',)



@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    inlines = [DiagnosisInline, PrescriptionInline]

    list_display = ('id', 'get_consultation_info', 'get_pet_name', 'get_vet_name', 'created_at')
    
    search_fields = (
        'consultation__id', 
        'consultation__pet__name', 
        'consultation__owner__email', 
        'notes'
    )
    
    list_filter = ('created_at',)
    
    ordering = ('-created_at',)

    readonly_fields = ('created_at',)


    def get_consultation_info(self, obj):
        return f"Consultation #{obj.consultation.id}"
    get_consultation_info.short_description = 'Consultation'

    def get_pet_name(self, obj):
        return obj.consultation.pet.name if obj.consultation.pet else "-"
    get_pet_name.short_description = 'Pet Name'

    def get_vet_name(self, obj):
        if obj.consultation.vet and hasattr(obj.consultation.vet, 'profile'):
            return obj.consultation.vet.profile.full_name or obj.consultation.vet.email
        return obj.consultation.vet.email
    get_vet_name.short_description = 'Veterinarian'


@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_record_id', 'description', 'created_at')
    search_fields = ('description', 'record__consultation__pet__name')
    readonly_fields = ('created_at',)

    def get_record_id(self, obj):
        return f"Record #{obj.record.id}"
    get_record_id.short_description = 'Medical Record'


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_record_id', 'medication', 'dosage', 'created_at')
    list_filter = ('medication', 'created_at')
    search_fields = ('medication', 'dosage', 'record__consultation__pet__name')
    readonly_fields = ('created_at',)

    def get_record_id(self, obj):
        return f"Record #{obj.record.id}"
    get_record_id.short_description = 'Medical Record'