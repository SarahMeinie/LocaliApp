from .views import FriendCreateViewSet, FollowingAPIView, FriendDeleteViewSet, FollowersAPIView
from django.conf.urls import url

urlpatterns = [
    
    # class based views:
	url(r'^create$', FriendCreateViewSet.as_view(), name="create-friends"),
    url(r'^(?P<id>\d+)/delete$', FriendDeleteViewSet.as_view(), name="delete-friendship"),
    url(r'^user$', FollowingAPIView.as_view(), name="following"),
    url(r'^followers$', FollowersAPIView.as_view(), name="followers"),
]