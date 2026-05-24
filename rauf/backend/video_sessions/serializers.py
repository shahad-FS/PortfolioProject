from rest_framework import serializers
from .models import VideoSession


class VideoSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = VideoSession
        fields = [
            "id",
            "consultation",
            "session_id",
            "join_url",
            "status",
            "started_at",
            "ended_at",

            "offer",
            "answer",
            "ice_candidates",

            "vet_joined",
            "owner_joined",
        ]

        read_only_fields = [
            "id",
            "consultation",
            "session_id",
            "join_url",
            "status",
            "started_at",
            "ended_at",
            "vet_joined",
            "owner_joined",
        ]
