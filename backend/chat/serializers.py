from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ("id", "room", "sender", "content", "created_at")
        read_only_fields = ("id", "sender", "created_at")


class RoomSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ("id", "name", "is_group", "created_at", "members")
        read_only_fields = ("id", "created_at", "members")
