from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event, EventParticipant
from .serializers import EventSerializer, EventParticipantSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, 'created_by_id', None) == request.user.id


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.select_related('created_by').prefetch_related('participants')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        status_val = request.data.get('status')
        if status_val not in {'yes', 'no', 'maybe'}:
            return Response({'detail': 'invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        ep, _ = EventParticipant.objects.get_or_create(event=event, user=request.user)
        ep.rsvp_status = status_val
        ep.save()
        return Response(EventParticipantSerializer(ep).data)
