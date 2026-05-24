from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory
from core.permissions.roles import IsPetOwner, IsVet, IsAdmin, IsVetOrPetOwner
from core.permissions.base import IsOwner

User = get_user_model()

class MockObject:
    def __init__(self, owner):
        self.owner = owner

class MockView:
    pass

class PermissionsTests(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = MockView()
        
        self.pet_owner_user = User.objects.create_user(email="owner@rauf.com", password="password123", role="pet_owner")
        self.vet_user = User.objects.create_user(email="vet@rauf.com", password="password123", role="vet")
        self.admin_user = User.objects.create_user(email="admin@rauf.com", password="password123", role="admin")
        self.anonymous_user = AnonymousUser()

    def test_is_pet_owner_permission(self):
        permission = IsPetOwner()
        request = self.factory.get('/')
        request.user = self.pet_owner_user
        self.assertTrue(permission.has_permission(request, self.view))
        request.user = self.vet_user
        self.assertFalse(permission.has_permission(request, self.view))
        request.user = self.anonymous_user
        self.assertFalse(permission.has_permission(request, self.view))

    def test_is_vet_permission(self):
        permission = IsVet()
        request = self.factory.get('/')
        request.user = self.vet_user
        self.assertTrue(permission.has_permission(request, self.view))
        request.user = self.pet_owner_user
        self.assertFalse(permission.has_permission(request, self.view))

    def test_is_admin_permission(self):
        permission = IsAdmin()
        request = self.factory.get('/')
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, self.view))
        request.user = self.vet_user
        self.assertFalse(permission.has_permission(request, self.view))

    def test_is_vet_or_pet_owner_permission(self):
        permission = IsVetOrPetOwner()
        request = self.factory.get('/')
        request.user = self.pet_owner_user
        self.assertTrue(permission.has_permission(request, self.view))
        request.user = self.vet_user
        self.assertTrue(permission.has_permission(request, self.view))
        request.user = self.admin_user
        self.assertFalse(permission.has_permission(request, self.view))

    def test_is_owner_object_permission(self):
        permission = IsOwner()
        request = self.factory.get('/')
        secure_object = MockObject(owner=self.pet_owner_user)
        request.user = self.pet_owner_user
        self.assertTrue(permission.has_object_permission(request, self.view, secure_object))
        request.user = self.vet_user
        self.assertFalse(permission.has_object_permission(request, self.view, secure_object))