from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events_created')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_time']


class EventParticipant(models.Model):
    RSVP_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
        ('maybe', 'Maybe'),
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rsvp_status = models.CharField(max_length=10, choices=RSVP_CHOICES, default='maybe')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')
