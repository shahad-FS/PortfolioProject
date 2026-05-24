import pytest
from video_sessions.serializers import VideoSessionSerializer
from video_sessions.tests.factories import VideoSessionFactory

@pytest.mark.django_db
def test_video_session_serializer_valid():
    
    session = VideoSessionFactory.create()
    
    
    serializer = VideoSessionSerializer(instance=session)
    
    
    data = serializer.data
    assert data["session_id"] == str(session.session_id)
    assert data["status"] == session.status
    assert data["vet_joined"] == session.vet_joined
    assert data["owner_joined"] == session.owner_joined

@pytest.mark.django_db
def test_video_session_serializer_read_only_fields():
    
    
    data = {
        "status": "ended" 
    }
    
    serializer = VideoSessionSerializer(data=data)
    
    
    assert serializer.is_valid()
    
    
    assert "status" not in serializer.validated_data

@pytest.mark.django_db
def test_video_session_serializer_fields_containment():
    
    session = VideoSessionFactory.create()
    serializer = VideoSessionSerializer(instance=session)
    data = serializer.data
    
    required_fields = [
        "id", "consultation", "session_id", "join_url", "status",
        "started_at", "ended_at", "offer", "answer", "ice_candidates",
        "vet_joined", "owner_joined"
    ]
    
    for field in required_fields:
        assert field in data