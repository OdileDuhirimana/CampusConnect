from rest_framework import serializers
from .models import Whisper


class WhisperSerializer(serializers.ModelSerializer):
    reactions_count = serializers.IntegerField(source='reactions.count', read_only=True)

    class Meta:
        model = Whisper
        fields = ("id", "body", "created_at", "reported", "reactions_count")
        read_only_fields = ("id", "created_at", "reported", "reactions_count")
