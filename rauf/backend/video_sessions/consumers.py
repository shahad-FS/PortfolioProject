# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class VideoCallConsumer(AsyncWebsocketConsumer):

    rooms = {}  # { room_id: [channel_name1, channel_name2] }

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["consultation_id"]
        self.room_group_name = f"video_{self.room_id}"

        # سجل المستخدم في الغرفة
        if self.room_id not in VideoCallConsumer.rooms:
            VideoCallConsumer.rooms[self.room_id] = []

        VideoCallConsumer.rooms[self.room_id].append(self.channel_name)

        # تحديد الدور
        if len(VideoCallConsumer.rooms[self.room_id]) == 1:
            self.role = "caller"
        else:
            self.role = "callee"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # أرسل الدور للفرونت
        await self.send(json.dumps({
            "type": "role",
            "role": self.role
        }))

        print(f"CONNECTED: room={self.room_id}, role={self.role}")

    async def disconnect(self, close_code):
        if self.room_id in VideoCallConsumer.rooms:
            if self.channel_name in VideoCallConsumer.rooms[self.room_id]:
                VideoCallConsumer.rooms[self.room_id].remove(self.channel_name)

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        # بث الرسالة للطرف الآخر
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "signal_message",
                "data": data,
                "sender": self.channel_name
            }
        )

    async def signal_message(self, event):
        # لا ترسل الرسالة لنفس المرسل
        if event["sender"] != self.channel_name:
            await self.send(json.dumps(event["data"]))

    async def video_call_started(self, event):
        await self.send(json.dumps({
            "type": "video_started",
            "consultation_id": event["consultation_id"],
            "session_id": event["session_id"],
            "join_url": event["join_url"],
        }))


class AppointmentsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "appointments_group"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print("Appointments WS connected")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print("Appointments WS disconnected")

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.send(text_data=json.dumps(data))

    async def video_started(self, event):
        await self.send(text_data=json.dumps({
            "type": "video_started",
            "consultation_id": event["consultation_id"],
            "session_id": event["session_id"],
            "join_url": event["join_url"],
        }))
