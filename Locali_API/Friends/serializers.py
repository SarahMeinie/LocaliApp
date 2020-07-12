from rest_framework.serializers import ModelSerializer
from .models import Followers


class CreateFollowSerializer(ModelSerializer):
    class Meta:
        model = Followers
        fields =['following']

class FollowSerializer(ModelSerializer):
    class Meta:
        model = Followers
        fields ='__all__'
