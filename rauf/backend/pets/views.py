from django.shortcuts import render


from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from .models import Pet
from .serializers import PetSerializer

from core.permissions.roles import IsPetOwner, IsVet, IsAdmin
from core.permissions.base import IsOwner


class PetListCreateView(generics.ListCreateAPIView):
    """
    GET:
        - pet_owner  يشوف pets حقته فقط
        - vet / admin  يشوفون الكل

    POST:
        - فقط pet_owner
    """

    serializer_class = PetSerializer

    def get_queryset(self):
        user = self.request.user

        base_queryset = Pet.objects.select_related("owner")

        if user.role == "pet_owner":
            return base_queryset.filter(owner=user)

        return base_queryset

    def get_permissions(self):
        if self.request.method == "POST":
            permission_classes = [IsPetOwner]
        else:
            permission_classes = [IsPetOwner | IsVet | IsAdmin]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET:
        - owner + vet + admin

    UPDATE / DELETE:
        - فقط owner
    """

    serializer_class = PetSerializer

    def get_queryset(self):
        user = self.request.user

        base_queryset = Pet.objects.select_related("owner")

        if user.role == "pet_owner":
            return base_queryset.filter(owner=user)

        return base_queryset

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [IsPetOwner | IsVet | IsAdmin]
        else:
            permission_classes = [IsPetOwner & IsOwner]

        return [permission() for permission in permission_classes]
