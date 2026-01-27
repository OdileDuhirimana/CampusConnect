from rest_framework import serializers
from .models import Event, EventParticipant


class EventParticipantSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ("id", "user", "rsvp_status", "joined_at")
        read_only_fields = ("id", "user", "joined_at")


class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    participants = EventParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "title",
            "description",
            "start_time",
            "end_time",
            "location",
            "created_by",
            "created_at",
            "participants",
        )
        read_only_fields = ("id", "created_by", "created_at", "participants")
