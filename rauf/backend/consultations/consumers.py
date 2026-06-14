import json
from channels.generic.websocket import AsyncWebsocketConsumer


class AppointmentsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "appointments"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # بث الرسالة لكل المستخدمين
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "broadcast",
                "data": data
            }
        )

    async def broadcast(self, event):
        await self.send(json.dumps(event["data"]))
