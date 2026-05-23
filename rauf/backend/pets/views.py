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
        - pet_owner: يشوف pets حقته فقط
        - vet: يشوف فقط الحيوانات اللي حاجزه عنده موعد
        - admin: يشوف الكل
    POST:
        - فقط pet_owner
    """
    serializer_class = PetSerializer

    def get_queryset(self):
        user = self.request.user
        
        # حماية إضافية إذا كان الطلب غير مسجل دخول
        if not user.is_authenticated:
            return Pet.objects.none()

        base_queryset = Pet.objects.select_related("owner")

        if user.role == "pet_owner":
            return base_queryset.filter(owner=user)

        if user.role == "vet":
  
            return base_queryset.filter(consultation__vet=user).distinct()

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
        - owner (حيواناته) + vet (المحجوزة عنده) + admin (الكل)
    UPDATE / DELETE:
        - فقط owner
    """
    serializer_class = PetSerializer

    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return Pet.objects.none()

        base_queryset = Pet.objects.select_related("owner")

        if user.role == "pet_owner":
            return base_queryset.filter(owner=user)

        if user.role == "vet":
            return base_queryset.filter(consultations__vet=user).distinct()

        return base_queryset

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            permission_classes = [IsPetOwner | IsVet | IsAdmin]
        else:
            permission_classes = [IsPetOwner & IsOwner]

        return [permission() for permission in permission_classes]