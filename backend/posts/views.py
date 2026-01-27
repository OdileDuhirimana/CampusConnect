from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, 'user_id', None) == request.user.id


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related('user').prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comment(self, request, pk=None):
        post = self.get_object()
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'content required'}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(post=post, user=request.user, content=content)
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        Like.objects.get_or_create(post=post, user=request.user)
        return Response({'liked': True})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        post = self.get_object()
        Like.objects.filter(post=post, user=request.user).delete()
        return Response({'liked': False})
