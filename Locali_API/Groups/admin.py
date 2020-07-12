from django.contrib import admin
from .models import Groups, Group_Posts, AddMember, AddAdmin

# Register your models here.
admin.site.register(Groups)
admin.site.register(Group_Posts)
admin.site.register(AddMember)
admin.site.register(AddAdmin)

