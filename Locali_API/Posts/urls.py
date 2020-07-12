from django.urls import path
from . import views
from .views import PostListView, PostDetailView, PostCreateView, PostUpdateView, PostDeleteView, UserPostListView
from django.conf.urls import url

urlpatterns = [
    
    # class based views:
    path('', PostListView.as_view(), name='blog-home'),
    path('user/<str:username>', UserPostListView.as_view(), name='user-posts'),
    url(r'^post/<int:pk>/$', PostDetailView.as_view(), name='post-detail'),
    path('post/new/', PostCreateView.as_view(), name='post-create'),
    path('post/<int:pk>/update', PostUpdateView.as_view(), name='post-update'),
    
    path('post/<int:pk>/delete', PostDeleteView.as_view(), name='post-delete'),

    # function based views:
    path('about/', views.about, name='blog-about'),
]

# PostListView.as_view() looks for template with the  naming convention:
# <app>/<model>_<viewtype>.html
# blog/post_list.html
