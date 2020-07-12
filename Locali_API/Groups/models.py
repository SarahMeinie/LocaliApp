from django.db import models
from django.utils import timezone
from django.conf import settings
from Posts.models import Post
from Profile.models import User


class Groups(models.Model):
    name = models.CharField(max_length = 64)
    created_at = models.DateTimeField(default = timezone.now, editable = False)
    admins = models.ManyToManyField(User, through = "AddAdmin", related_name = 'group_admins', blank = True)
    members = models.ManyToManyField(User, through = "AddMember", related_name = 'group_members', blank=True)

    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'
        

    def __str__(self):
        return self.name

class AddMember(models.Model):
    member = models.ForeignKey(User, on_delete =models.CASCADE)
    group = models.ForeignKey(Groups, on_delete= models.CASCADE)

    class Meta:
        verbose_name = 'Add Memeber'
        verbose_name_plural = 'Add Memebers'
        unique_together = (('group', 'member'), )
    
    def __str__(self):
        return f"Added user {self.member} to  {self.group} as member"


class AddAdmin(models.Model):
    admin = models.ForeignKey(User, on_delete =models.CASCADE)
    group = models.ForeignKey(Groups, on_delete= models.CASCADE)

    class Meta:
        verbose_name = 'Add Admin'
        verbose_name_plural = 'Add Admin'
        unique_together = (('group', 'admin'), )

    def __str__(self):
        return f"Added user  {self.admin} to  {self.group} as admin"
    

class Group_Posts(models.Model):
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    group = models.ForeignKey(Groups, on_delete = models.CASCADE)
    
    def __str__(self):
        return self.post + " in " + self.group

    class Meta:
        verbose_name = 'Group Post'
        verbose_name_plural = 'Group Posts'
        unique_together = (('group', 'post'), )
        
