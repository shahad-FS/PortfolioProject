from rest_framework import status
from django.shortcuts import render

# Create your views here.
import uuid
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import VideoSession
from consultations.models import Consultation
from .serializers import VideoSessionSerializer
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404


class CreateVideoSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, consultation_id):

        consultation = Consultation.objects.get(id=consultation_id)

        session, created = VideoSession.objects.get_or_create(
            consultation=consultation,
            defaults={
                "session_id": str(uuid.uuid4()),
                "join_url": f"/video-call/{consultation.id}/"
            }
        )

        serializer = VideoSessionSerializer(session)

        return Response(serializer.data)


class StartVideoCallView(APIView):

    def post(self, request, consultation_id):

        consultation = Consultation.objects.get(id=consultation_id)

        session, created = VideoSession.objects.get_or_create(
            consultation=consultation,
            defaults={
                "session_id": str(uuid.uuid4()),
                "join_url": f"/video-call/{consultation.id}",
            }
        )

        session.status = "started"
        session.save()

        return Response({
            "message": "Video call started",
            "session_id": session.session_id,
            "join_url": session.join_url,
            "status": session.status,
        })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_video_call(request, consultation_id):
    try:
        consultation = Consultation.objects.get(id=consultation_id)

        session, created = VideoSession.objects.get_or_create(
            consultation=consultation,
            defaults={
                "session_id": str(uuid.uuid4()),
                "join_url": f"/video-call/{consultation.id}",
            }
        )

        session.status = "started"
        session.save()

        # ✅ IMPORTANT FIX
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "appointments_group",
            {
                "type": "video_started",
                "consultation_id": consultation.id,
                "session_id": session.session_id,
                "join_url": session.join_url,
            }
        )

        return Response({
            "message": "Video call started",
            "session_id": session.session_id,
            "consultation_id": consultation.id,
            "join_url": session.join_url,
        })

    except Consultation.DoesNotExist:
        return Response(
            {"error": "Consultation not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:
        print("VIDEO SESSION ERROR:", str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
