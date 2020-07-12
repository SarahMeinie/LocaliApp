from rest_framework.serializers import ModelSerializer, DateTimeField, CharField
from rest_framework import serializers
from .models import Group_Posts, Groups, AddAdmin, AddMember
from Profile.models import User
from Profile.api.serializers import UserPropertiesSerializer

class GroupsCreateSerializer(ModelSerializer):
    created_at = DateTimeField(read_only=True)

    class Meta:
        model = Groups
        fields = ['name', 'created_at', 'admins', 'members']

class GroupPostsSerializer(ModelSerializer):
    class Meta:
        model = Group_Posts
        fields =  ['id', 'post', 'group']
    
class GroupPostsCreateSerializer(ModelSerializer):
    class Meta:
        model = Group_Posts
        fields =  ['post', 'group']

class GroupsSerializer(ModelSerializer):

    class Meta:
        model = Groups
        fields = ['id', 'name', 'created_at', 'admins', 'members']

class GroupsUpdateSerializerMembers(ModelSerializer):
    name = CharField(read_only=True)
    created_at = DateTimeField(read_only=True)
    admins = UserPropertiesSerializer(read_only=True, many=True)

    class Meta:
        model = Groups
        fields = ['id', 'name', 'admins', 'members', 'created_at' ]

class GroupsUpdateSerializerAdmins(ModelSerializer):
    name = CharField(read_only=True)
    created_at = DateTimeField(read_only=True)
    members = UserPropertiesSerializer(read_only=True, many=True)

    class Meta:
        model = Groups
        fields = ['id', 'name', 'members', 'admins',  'created_at' ]

class GroupsAddAdminSerializer(ModelSerializer):

    class Meta:
        model = AddAdmin
        fields = ['id', 'admin',  'group' ]

class GroupsAddMemberSerializer(ModelSerializer):

    class Meta:
        model = AddMember
        fields = ['id', 'member',  'group' ]


