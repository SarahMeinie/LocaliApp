from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from rest_framework_extensions.mixins import NestedViewSetMixin
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.gis.db.models.functions import Distance
from rest_framework import viewsets ,permissions, generics
from django.contrib.auth.models import Permission
from rest_flex_fields import FlexFieldsModelViewSet
from .models import Post, Comment, Like, Category
from django.shortcuts import render, get_object_or_404
from Profile.models import User as CustomUser
from rest_framework.decorators import action
from django.contrib.gis.measure import D
from rest_framework import filters
from django.db.models import Q
import django_filters

from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView
    )
from .serializers import (
    PostsSerializer, 
    CommentsSerializer, 
    LikesViewSerializer, 
    CategorySerializer
    )




# function based views:
def home(request):
    context = {
        'posts': Post.objects.all()
    }
    return render(request, 'Posts/home.html', context)


# class based view, inherit from ListView
class PostListView(ListView):
    model = Post
    template_name = 'Posts/home.html' # <app>/<model>_<viewtype>.html
    context_object_name = 'posts'
    ordering = ['-posted_at']
    paginate_by = 10
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['categories', 'body', 'user__username']


class UserPostListView(ListView):
    model = Post
    template_name = 'Posts/user_posts.html' # <app>/<model>_<viewtype>.html
    context_object_name = 'posts'
    ordering = ['-posted_at']
    paginate_by = 10

    # get posts from a specific user
    def get_queryset(self):
        user = get_object_or_404(CustomUser, username=self.kwargs.get('username'))
        return Post.objects.filter(user=user).order_by('-posted_at')
        

class PostDetailView(LoginRequiredMixin, DetailView):
    model = Post
    fields = ['categories', 'body', 'Latitude', 'Longitude']

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['categories', 'body', 'Latitude', 'Longitude']

    # override the form_valid method:
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'user', None) is None:
            obj.user = request.user
        obj.save()

class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['body']

    # override the form_valid method:
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.user


class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    success_url = '/'

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.user


class PostsViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('posted_at')
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None



class LikesViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikesViewSerializer
    permission_classes = [permissions.IsAuthenticated]



# returns all of the categories
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None



def about(request):
    return render(request, 'Posts/about.html', {'body': 'About'})
