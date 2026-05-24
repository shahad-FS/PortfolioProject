import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import VideoSession
from consultations.models import Consultation
from .serializers import VideoSessionSerializer


from core.permissions.roles import IsVet, IsPetOwner

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class CreateVideoSessionView(APIView):
    permission_classes = [IsAuthenticated, IsVet]

    def post(self, request, consultation_id):
        consultation = get_object_or_404(Consultation, id=consultation_id)

        session = VideoSession.objects.filter(
            consultation=consultation).first()

        if not session:
            return Response(
                {"error": "Session not started yet"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(VideoSessionSerializer(session).data)




class StartVideoSession(APIView):
    def post(self, request, consultation_id):
        consultation = get_object_or_404(
            Consultation,
            id=consultation_id
        )

        # إنشاء أو جلب session موجودة
        session, created = VideoSession.objects.get_or_create(
            consultation=consultation,
            defaults={
                "status": "started",
                "join_url": "/video-call/"
            }
        )

        # تحديث البيانات
        session.status = "started"

        join_url = f"/video-call/{session.session_id}/"

        session.join_url = join_url
        session.save()

        # إرسال event لكل المتصلين
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "appointments",
            {
                "type": "broadcast",
                "data": {
                    "type": "video_started",
                    "consultation_id": consultation.id,
                    "session_id": str(session.session_id),
                    "join_url": join_url,
                },
            },
        )

        return Response({
            "session_id": str(session.session_id),
            "join_url": join_url,
            "status": "started"
        })


class SendOfferView(APIView):
    permission_classes = [IsAuthenticated, IsVet]

    def post(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)

        session.offer = request.data.get("offer")
        session.save()

        return Response({"message": "Offer saved"})


class SendAnswerView(APIView):
    permission_classes = [IsAuthenticated, IsPetOwner]

    def post(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)

        session.answer = request.data.get("answer")
        session.save()

        return Response({"message": "Answer saved"})


class AddIceCandidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)

        candidate = request.data.get("candidate")

        if candidate:
            session.ice_candidates.append(candidate)
            session.save()

        return Response({"message": "Candidate added"})


class UpdateJoinStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)

        role = request.data.get("role")

        if role == "vet":
            session.vet_joined = True
        elif role == "owner":
            session.owner_joined = True

        session.save()

        return Response({"message": "Join status updated"})


class EndVideoCallView(APIView):
    permission_classes = [IsAuthenticated, IsVet]

    def post(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)

        session.status = "ended"
        session.save()

        return Response({"message": "Video call ended"})


class GetVideoSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(VideoSession, session_id=session_id)
        return Response(VideoSessionSerializer(session).data)
