from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.prefetch_related('members')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        room = serializer.save()
        room.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        room.members.add(request.user)
        return Response(RoomSerializer(room).data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        room.members.remove(request.user)
        return Response(RoomSerializer(room).data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.select_related('room', 'sender').order_by('created_at')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        room_id = self.request.query_params.get('room')
        if room_id:
            try:
                qs = qs.filter(room_id=int(room_id))
            except ValueError:
                pass
        return qs
