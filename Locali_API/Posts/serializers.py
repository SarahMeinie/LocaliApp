from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer
from .models import Category, Post, Comment, Like
from django.contrib.auth.models import Permission
from rest_framework.serializers import IntegerField

class PostUpdatePropertiesSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'body',
            'Latitude',
            'Longitude',
        ]

class PostCreateSerializer(ModelSerializer):
    id = IntegerField(read_only=True)
    class Meta:
        model = Post
        fields = [
            'id',
            'body',
            #'user',
            'Latitude',
            'Longitude',
            'private',
            'categories'
        ]

#class PostsSerializer(serializers.HyperlinkedModelSerializer):
class PostsSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'id', 
            'Latitude', 
            'Longitude', 
            'body', 
            'user', 
            'posted_at', 
            'private', 
            'categories'
        ]



class CommentsSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id',
            'user',
            'body',
            'post'
        ]


class CommentsUpdateSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'body',
        ]

class CommentsCreateSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'body',
            'post'
        ]

class LikesViewSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = [
            'id',
            'user', 
            'post', 
        ]

class LikesCreateSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = [
            #'user', 
            'post', 
        ]

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'tag', 
            'colour'
        ]
