from rest_framework import serializers
from .models import Group, GroupMember, GroupPost


class GroupMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = GroupMember
        fields = ("id", "user", "joined_at")
        read_only_fields = ("id", "user", "joined_at")


class GroupPostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = GroupPost
        fields = ("id", "user", "content", "created_at")
        read_only_fields = ("id", "user", "created_at")


class GroupSerializer(serializers.ModelSerializer):
    members = GroupMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ("id", "name", "description", "created_by", "created_at", "members")
        read_only_fields = ("id", "created_by", "created_at", "members")
