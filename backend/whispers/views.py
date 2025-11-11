from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Whisper, WhisperReaction
from .serializers import WhisperSerializer


class WhisperViewSet(viewsets.ModelViewSet):
    queryset = Whisper.objects.all().prefetch_related('reactions')
    serializer_class = WhisperSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def react(self, request, pk=None):
        whisper = self.get_object()
        emoji = request.data.get('emoji', '❤️')
        WhisperReaction.objects.get_or_create(whisper=whisper, user=request.user, emoji=emoji)
        return Response({"reacted": True})

    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        whisper = self.get_object()
        whisper.reported = True
        whisper.save()
        return Response({"reported": True})

    @action(detail=False, methods=['get'])
    def trending(self, request):
        qs = Whisper.objects.all()
        return Response(WhisperSerializer(qs[:20], many=True).data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def moderation(self, request):
        qs = Whisper.objects.filter(reported=True)
        return Response(WhisperSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def moderate(self, request, pk=None):
        whisper = self.get_object()
        action = request.data.get('action')
        if action == 'remove':
            whisper.delete()
            return Response({"removed": True})
        whisper.reported = False
        whisper.save()
        return Response({"approved": True})

# Create your views here.
