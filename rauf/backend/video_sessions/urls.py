from django.urls import path
from .views import (
    CreateVideoSessionView,
    SendOfferView,
    SendAnswerView,
    AddIceCandidateView,
    UpdateJoinStatusView,
    EndVideoCallView,
    GetVideoSessionView,
    StartVideoSession
)

urlpatterns = [


    path(
        "create/<int:consultation_id>/",
        CreateVideoSessionView.as_view(),
        name="create-video-session"
    ),

    path(
        "start/<int:consultation_id>/", StartVideoSession.as_view(),
        name="start-video-call"
    ),


    path(
        "offer/<str:session_id>/",
        SendOfferView.as_view(),
        name="send-offer"
    ),


    path(
        "answer/<str:session_id>/",
        SendAnswerView.as_view(),
        name="send-answer"
    ),

    path(
        "ice/<str:session_id>/",
        AddIceCandidateView.as_view(),
        name="add-ice-candidate"
    ),


    path(
        "join-status/<str:session_id>/",
        UpdateJoinStatusView.as_view(),
        name="update-join-status"
    ),

    path(
        "end/<str:session_id>/",
        EndVideoCallView.as_view(),
        name="end-video-call"
    ),

    path(
        "session/<str:session_id>/",
        GetVideoSessionView.as_view(),
        name="get-video-session"
    ),
]
