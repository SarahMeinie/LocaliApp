from rest_framework.serializers import HyperlinkedModelSerializer
from .models import User
from django.contrib.auth.models import Permission


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'email',
            'image',
            'first_name',
            'last_name',
            'is_active',
            'is_staff'
        ]


class PermissionSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Permission
