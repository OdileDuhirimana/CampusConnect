from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Group, GroupMember, GroupPost
from .serializers import GroupSerializer, GroupMemberSerializer, GroupPostSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.prefetch_related('members')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        GroupMember.objects.get_or_create(group=group, user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        group = self.get_object()
        GroupMember.objects.get_or_create(group=group, user=request.user)
        return Response(GroupSerializer(group).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        group = self.get_object()
        GroupMember.objects.filter(group=group, user=request.user).delete()
        return Response(GroupSerializer(group).data)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        group = self.get_object()
        return Response(GroupMemberSerializer(group.members.all(), many=True).data)

    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def posts(self, request, pk=None):
        group = self.get_object()
        if request.method == 'POST':
            content = request.data.get('content', '').strip()
            if not content:
                return Response({"detail": "content required"}, status=status.HTTP_400_BAD_REQUEST)
            post = GroupPost.objects.create(group=group, user=request.user, content=content)
            return Response(GroupPostSerializer(post).data, status=status.HTTP_201_CREATED)
        return Response(GroupPostSerializer(group.posts.all(), many=True).data)

# Create your views here.
