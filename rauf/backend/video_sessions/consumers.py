import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from video_sessions.models import VideoSession


class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.group_name = f"video_{self.session_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # جلب الـ session
        self.session = await database_sync_to_async(VideoSession.objects.get)(session_id=self.session_id)

        # تحديد الدور
        role = await self.get_role()

        await self.send(json.dumps({
            "type": "role",
            "role": role
        }))

        # إعلام الطرف الآخر
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "peer_joined",
                "sender": self.channel_name
            }
        )

    async def get_role(self):

        if not self.session.vet_joined:
            self.session.vet_joined = True
            await database_sync_to_async(self.session.save)()
            return "caller"

        if not self.session.owner_joined:
            self.session.owner_joined = True
            await database_sync_to_async(self.session.save)()
            return "callee"

        return "callee"

    async def peer_joined(self, event):
        if event["sender"] == self.channel_name:
            return

        await self.send(json.dumps({
            "type": "peer_joined"
        }))



    async def receive(self, text_data):
        print("📨 RECEIVED:", text_data)
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
        print("📡 RELAY:", event["data"])

        if event["sender"] == self.channel_name:
            return

        await self.send(text_data=json.dumps(event["data"]))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)