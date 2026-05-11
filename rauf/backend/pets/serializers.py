from rest_framework import serializers
from .models import Pet


class PetSerializer(serializers.ModelSerializer):
    """
    Serializer لتحويل بيانات Pet:
    - من Model → JSON (response)
    - من JSON → Model (request)
    """

    class Meta:
        model = Pet
        fields = "__all__"
        read_only_fields = ["owner", "created_at"]

    def get_age(self, obj):
        from datetime import datetime
        current_year = datetime.now().year
        return current_year - obj.birth_year
