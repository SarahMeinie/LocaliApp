from django.db import models
from django.conf import settings

class Followers(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'user', on_delete = models.CASCADE)
    following = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'following', on_delete = models.CASCADE)

    class Meta:
        verbose_name = 'Follower'
        verbose_name_plural = 'Followers'
        unique_together = (('following', 'user'), )
