from django.db.models.signals import post_save
from .models import User as Profile
# sender
from django.contrib.auth.models import User
# reciever
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # creates a Profile object and links it when a new user is created
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
