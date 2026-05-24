import pytest
from channels.routing import URLRouter
from channels.testing import WebsocketCommunicator
from channels.db import database_sync_to_async

from video_sessions.routing import websocket_urlpatterns
from video_sessions.tests.factories import VideoSessionFactory



@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_video_call_consumer_connection(settings):
    
    settings.CHANNEL_LAYERS = {
        "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
    }
    
    
    application = URLRouter(websocket_urlpatterns)
    
    
    session = await database_sync_to_async(VideoSessionFactory.create)(
        vet_joined=False,
        owner_joined=False
    )
    
    communicator = WebsocketCommunicator(application, f"/ws/video/{session.session_id}/")
    
    
    connected, _ = await communicator.connect(timeout=5)
    assert connected is True, "Failed to connect to the WebSocket"
    
    
    response = await communicator.receive_json_from(timeout=5)
    assert response["type"] == "role"
    assert response["role"] == "caller"
    
    await communicator.disconnect()

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
async def test_relay_message_between_peers(settings):
    
    settings.CHANNEL_LAYERS = {
        "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
    }
    application = URLRouter(websocket_urlpatterns)
    
    session = await database_sync_to_async(VideoSessionFactory.create)(
        vet_joined=False,
        owner_joined=False
    )
    
    comm_a = WebsocketCommunicator(application, f"/ws/video/{session.session_id}/")
    comm_b = WebsocketCommunicator(application, f"/ws/video/{session.session_id}/")
    
    
    connected_a, _ = await comm_a.connect(timeout=5)
    assert connected_a is True
    res_a = await comm_a.receive_json_from(timeout=5)  
    assert res_a["role"] == "caller"
    
    
    connected_b, _ = await comm_b.connect(timeout=5)
    assert connected_b is True
    res_b = await comm_b.receive_json_from(timeout=5)  
    assert res_b["role"] == "callee"
    
    
    peer_join_msg = await comm_a.receive_json_from(timeout=5)
    assert peer_join_msg["type"] == "peer_joined"
    
    
    test_payload = {"type": "signal", "sdp": "dummy_sdp"}
    await comm_a.send_json_to(test_payload)
    
    
    received_by_b = await comm_b.receive_json_from(timeout=5)
    assert received_by_b == test_payload
    
    await comm_a.disconnect()
    await comm_b.disconnect()