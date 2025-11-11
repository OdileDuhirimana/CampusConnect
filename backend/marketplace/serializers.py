from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Listing
        fields = ("id", "seller", "title", "description", "price", "created_at")
        read_only_fields = ("id", "seller", "created_at")
