from django.db import models
from django.contrib.auth.models import User


class Room(models.Model):
    name = models.CharField(max_length=255)
    is_group = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='chat_rooms', blank=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_by = models.ManyToManyField(User, related_name='messages_read', blank=True)

    class Meta:
        ordering = ['created_at']
