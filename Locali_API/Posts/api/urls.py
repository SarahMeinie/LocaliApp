from django.urls import path
from . import views
from .views import *
from django.conf.urls import url

urlpatterns = [
    
    # class based views:
	url(r'^(?P<id>\d+)/update$', PostsUpdateViewSet.as_view(), name="update-post"),
	url(r'^(?P<id>\d+)/delete$', PostsDeleteViewSet.as_view(), name="delete-post"),
    url(r'^create$', PostsCreateViewSet.as_view(), name="create-post"),
    url(r'^likes/(?P<post>\d+)/$', LikesPostViewSet.as_view(), name='post-likes'),
    url(r'^likes/create/$', LikesCreateViewSet.as_view(), name="create-like"),
    url(r'^likes/(?P<post>\d+)/delete$', LikesDeleteViewSet.as_view(), name='delete-like'),
    url(r'^comments/(?P<id>\d+)/delete$', CommentsDeleteViewSet.as_view(), name='delete-comments'),
    url(r'^comments/create/$', CommentsCreateViewSet.as_view(), name='create-comments'),
    url(r'^comments/(?P<id>\d+)/update$', CommentsUpdateViewSet.as_view(), name="update-comment"),
    url(r'^comments/(?P<post>\d+)/$', CommentsPostViewSet.as_view(), name='comments-on-post'),
    url(r'^ordered/(?P<lat>.+)/(?P<long>.+)/$', PostsNearestOrderViewSet.as_view(), name = 'ordered-posts'),
    url(r'^ordered/newest/$', PostListAPIViewNewest.as_view(), name = 'ordered-posts-newest-oldest'),
    url(r'^ordered/oldest/$', PostListAPIViewOldest.as_view(), name = 'ordered-posts-oldest-newest'),
    url(r'^user/(?P<user>.+)/$', UserPostAPIView.as_view(), name = 'user-posts'),
    url(r'^filter$', PostsFilterViewSet.as_view(), name = 'posts-filter'),
    url(r'^radius/(?P<radius>.+)/(?P<lat>.+)/(?P<long>.+)/$', PostsRadiusViewSet.as_view(), name ='posts-radius-filter'),
    url(r'^following$', FollowingPostsViews.as_view(), name ='posts-of-following'),
    url(r'^categories/$', CategoryPostAPIView.as_view(), name="category-filter"),
    
    path('comments/search/', CommentsAPIView.as_view()),

]

