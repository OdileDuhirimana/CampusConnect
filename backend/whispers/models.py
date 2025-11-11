from django.db import models
from django.contrib.auth.models import User


class Whisper(models.Model):
    body = models.TextField()
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    reported = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']


class WhisperReaction(models.Model):
    whisper = models.ForeignKey(Whisper, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emoji = models.CharField(max_length=12, default='❤️')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('whisper', 'user', 'emoji')

# Create your models here.
