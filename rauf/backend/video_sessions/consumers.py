import json
import traceback
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db import transaction
from video_sessions.models import VideoSession


class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
            self.group_name = f"video_{self.session_id}"

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            
            role = await self.get_session_and_assign_role(self.session_id)

            
            await self.send(text_data=json.dumps({
                "type": "role",
                "role": role
            }))

            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "peer_joined",
                    "sender": self.channel_name
                }
            )
        
        except Exception as e:
            print(f"❌ ERROR IN CONNECT: {e}")
            traceback.print_exc()
            await self.close()

    @database_sync_to_async
    def get_session(self, session_id):
        return VideoSession.objects.get(session_id=session_id)
    
    @database_sync_to_async
    def get_session_and_assign_role(self, session_id):
        
        try:
            session = VideoSession.objects.get(session_id=session_id)
            
            if not session.vet_joined:
                session.vet_joined = True
                session.save(update_fields=['vet_joined'])
                return "caller"

            if not session.owner_joined:
                session.owner_joined = True
                session.save(update_fields=['owner_joined'])
                return "callee"

            return "callee"
        except VideoSession.DoesNotExist:
            return "caller"

    async def peer_joined(self, event):
        if event["sender"] == self.channel_name:
            return
        await self.send(text_data=json.dumps({"type": "peer_joined"}))

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "relay",
                    "data": data,
                    "sender": self.channel_name
                }
            )

    async def relay(self, event):
        if event["sender"] == self.channel_name:
            return
        await self.send(text_data=json.dumps(event["data"]))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)