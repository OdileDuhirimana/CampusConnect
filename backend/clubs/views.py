from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Club, ClubMember
from .serializers import ClubSerializer, ClubMemberSerializer


class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.prefetch_related('members')
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        club = serializer.save(created_by=self.request.user)
        ClubMember.objects.get_or_create(club=club, user=self.request.user, role='admin')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        club = self.get_object()
        ClubMember.objects.get_or_create(club=club, user=request.user)
        return Response(ClubSerializer(club).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        club = self.get_object()
        ClubMember.objects.filter(club=club, user=request.user).delete()
        return Response(ClubSerializer(club).data)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        club = self.get_object()
        return Response(ClubMemberSerializer(club.members.all(), many=True).data)

# Create your views here.
