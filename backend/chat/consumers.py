from channels.generic.websocket import AsyncJsonWebsocketConsumer


class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.group_name = f"chat_room_{self.room_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"type": "welcome", "room_id": self.room_id})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Broadcast incoming JSON to the room group
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "chat.message", "payload": content},
        )

    async def chat_message(self, event):
        await self.send_json({"type": "message", "data": event["payload"]})
