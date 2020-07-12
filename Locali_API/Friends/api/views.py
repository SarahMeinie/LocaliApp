from django.shortcuts import render
from Friends.models import Followers
from Friends.serializers import CreateFollowSerializer, FollowSerializer
from rest_framework import viewsets, permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView, DestroyAPIView, CreateAPIView
from django.http.request import QueryDict

# Create your views here.
class FriendCreateViewSet(CreateAPIView):
    queryset = Followers.objects.all()
    serializer_class = CreateFollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class FriendDeleteViewSet(DestroyAPIView):
    queryset = Followers.objects.all()
    serializer_class = CreateFollowSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'


class FriendSpecificUserViewSet(ListAPIView):
    queryset = Followers.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

        
# Returns all of people who follow a user
class FollowersAPIView(ListAPIView):
    queryset = Followers.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):     
        req = QueryDict(self.request.body)
        if req.__contains__('following') and len(req) == 1:
            followid = (str)(req['following'])          

            return Followers.objects.filter(following=followid)

# Returns all of the people a user follows
class FollowingAPIView(ListAPIView):
    queryset = Followers.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):     
        req = QueryDict(self.request.body)

        if req.__contains__('user') and len(req) == 1:
            userid = (str)(req['user'])          

            return Followers.objects.filter(user=userid)
    

