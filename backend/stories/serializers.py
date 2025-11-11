from rest_framework import serializers
from .models import Story


class StorySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    views_count = serializers.IntegerField(source='views.count', read_only=True)

    class Meta:
        model = Story
        fields = ("id", "user", "image", "text", "created_at", "expires_at", "views_count")
        read_only_fields = ("id", "user", "created_at", "views_count")
