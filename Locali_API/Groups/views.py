
from django.shortcuts import render
from Groups.models import Groups, Group_Posts, AddAdmin, AddMember
from Groups.serializers import GroupPostsCreateSerializer, GroupsAddMemberSerializer, GroupsAddAdminSerializer, GroupsSerializer, GroupPostsSerializer, GroupsCreateSerializer, GroupsUpdateSerializerMembers, GroupsUpdateSerializerAdmins
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions
from django.http.request import QueryDict
from Posts.models import Post
from rest_framework.response import Response
from Profile.models import User

class GroupViewSet(ModelViewSet):
    queryset = Groups.objects.all()
    serializer_class = GroupsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)

class AddAdminViewSet(CreateAPIView):
    queryset = AddAdmin.objects.all()
    serializer_class = GroupsAddAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

   
class AddMemberViewSet(CreateAPIView):
    queryset = AddMember.objects.all()
    serializer_class = GroupsAddMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

class MemberDeleteViewSet(DestroyAPIView):
    queryset = AddMember.objects.all()
    serializer_class = GroupsAddMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        req = QueryDict(self.request.body)
        group = (req['group'])
        return AddMember.objects.get(member=self.request.user.id, group=group)

class GroupPostsCreateViewSet(CreateAPIView):
    queryset = Group_Posts.objects.all()
    serializer_class = GroupPostsCreateSerializer
    permission_classes = [permissions.IsAuthenticated]



class GroupCreateViewSet(CreateAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupsCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class PostsInGroupViewSet(ListAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupPostsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Group_Posts.objects.all()
        groupid = self.kwargs['group']
        if groupid is not None:
            return Group_Posts.objects.filter(group__id=groupid)

class UsersGroupViewSet(ListAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Groups.objects.all()
        return Groups.objects.filter(members__username__icontains=self.request.user.username)


# Display all of the Group Posts
class GroupPostsViewSet(ModelViewSet):
    queryset = Group_Posts.objects.all()
    serializer_class = GroupPostsSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupMembersUpdateViewSet(UpdateAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupsUpdateSerializerMembers
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class GroupAdminsUpdateViewSet(UpdateAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupsUpdateSerializerAdmins
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

#delete
class GroupPostsDeleteViewSet(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = GroupPostsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class GroupDeleteViewSet(DestroyAPIView):
    queryset = Groups.objects.all()
    serializer_class = GroupsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

