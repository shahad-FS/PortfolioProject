import factory
from django.contrib.auth import get_user_model
from consultations.models import Consultation
from pets.models import Pet
from video_sessions.models import VideoSession

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    email = factory.Sequence(lambda n: f"user{n}@test.com")
    password = 'password123'

class PetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Pet
    name = "Buddy"
    birth_year = 2024
    owner = factory.SubFactory(UserFactory)

class ConsultationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Consultation
    owner = factory.SubFactory(UserFactory)
    vet = factory.SubFactory(UserFactory)
    pet = factory.SubFactory(PetFactory)
    status = 'booked'

class VideoSessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VideoSession
    consultation = factory.SubFactory(ConsultationFactory)
    session_id = factory.Faker('uuid4')
    status = 'waiting'