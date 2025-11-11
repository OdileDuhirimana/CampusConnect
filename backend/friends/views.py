from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import FriendRequest
from .serializers import FriendRequestSerializer


class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user)

    def perform_create(self, serializer):
        to_id = self.request.data.get('to_user_id')
        to_user = User.objects.filter(id=to_id).first()
        serializer.save(from_user=self.request.user, to_user=to_user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        fr = self.get_object()
        fr.status = 'accepted'
        fr.save()
        return Response(FriendRequestSerializer(fr).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        fr = self.get_object()
        fr.status = 'declined'
        fr.save()
        return Response(FriendRequestSerializer(fr).data)

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        users = User.objects.exclude(id=request.user.id)[:10]
        return Response([{"id": u.id, "username": u.username} for u in users])

# Create your views here.
