from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        n = self.get_object()
        n.read = True
        n.save()
        return Response(NotificationSerializer(n).data)

    @action(detail=False, methods=['post'])
    def read_all(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({"read_all": True})

# Create your views here.
