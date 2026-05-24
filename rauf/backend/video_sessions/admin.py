from django.contrib import admin
from .models import VideoSession

@admin.register(VideoSession)
class VideoSessionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'get_consultation_id', 
        'session_id', 
        'status', 
        'vet_joined', 
        'owner_joined', 
        'started_at', 
        'ended_at'
    )
    
    list_filter = ('status', 'vet_joined', 'owner_joined', 'started_at')
    
    search_fields = ('consultation__id', 'session_id')
    
    list_editable = ('status',)
    
    ordering = ('-started_at', '-id')

    fieldsets = (
        ('Session Connection', {
            'fields': ('consultation', 'session_id', 'join_url')
        }),
        ('Live Attendance & Status', {
            'fields': ('status', 'vet_joined', 'owner_joined')
        }),
        ('Time Logs', {
            'fields': ('started_at', 'ended_at')
        }),
        ('WebRTC Technical Data (Signaling)', {
            'classes': ('collapse',), 
            'fields': ('offer', 'answer', 'ice_candidates'),
            'description': 'This data is for WebRTC signaling troubleshooting and should not be modified manually.'
        }),
    )

    readonly_fields = ('session_id', 'started_at', 'ended_at')

    def get_consultation_id(self, obj):
        return f"Consultation #{obj.consultation.id}" if obj.consultation else "-"
    get_consultation_id.short_description = 'Consultation'