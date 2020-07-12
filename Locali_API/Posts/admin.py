from django.contrib import admin
from django.contrib.gis import admin

from .models import Post, Comment, Like, Category

# Register your models here.   

class PostAdmin(admin.OSMGeoAdmin, admin.ModelAdmin):
    exclude=("locat ",)
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['locat']
        else:
            return []   


admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Category)
