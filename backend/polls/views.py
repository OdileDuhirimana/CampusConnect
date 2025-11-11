from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Poll, PollOption, PollVote
from .serializers import PollSerializer


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.prefetch_related('options', 'votes')
    serializer_class = PollSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        poll = serializer.save(created_by=self.request.user)
        options = self.request.data.get('options', [])
        for opt in options:
            PollOption.objects.create(poll=poll, text=opt)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        poll = self.get_object()
        option_id = request.data.get('option_id')
        if not option_id:
            return Response({"detail": "option_id required"}, status=status.HTTP_400_BAD_REQUEST)
        option = PollOption.objects.filter(id=option_id, poll=poll).first()
        if not option:
            return Response({"detail": "invalid option"}, status=status.HTTP_400_BAD_REQUEST)
        PollVote.objects.update_or_create(poll=poll, user=request.user, defaults={'option': option})
        return Response({"voted": True})

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        poll = self.get_object()
        return Response(PollSerializer(poll).data)

# Create your views here.
