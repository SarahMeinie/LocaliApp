from django.db import models
from django.utils import timezone
from django.conf import settings

class Message(models.Model):
    sent_at = models.DateTimeField(default = timezone.now, editable = False)
    body = models.TextField()
    #sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'send_message',on_delete = models.CASCADE)
    #recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'recieved_message', on_delete = models.CASCADE)
