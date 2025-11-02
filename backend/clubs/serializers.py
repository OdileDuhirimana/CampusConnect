from rest_framework import serializers
from .models import Club, ClubMember


class ClubMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ClubMember
        fields = ("id", "user", "role", "joined_at")
        read_only_fields = ("id", "user", "joined_at")


class ClubSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    members = ClubMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Club
        fields = ("id", "name", "description", "created_by", "created_at", "members")
        read_only_fields = ("id", "created_by", "created_at", "members")
