from django.contrib.gis.db.models.functions import Distance
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView, DestroyAPIView, CreateAPIView
from api.filters import DynamicSearchFilter
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework import filters, permissions
from Posts.models import Post, Like, Comment
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.core import serializers
from django.http import HttpResponse, JsonResponse
import json
from Posts.serializers import *
from django.contrib.gis.geos import Point
from django.utils import timezone
from django.contrib.gis.measure import D
from datetime import date
from django.http.request import QueryDict
from django.utils.safestring import mark_safe
from Friends.models import Followers

SUCCESS = 'success'
ERROR = 'error'
DELETE_SUCCESS = 'deleted'
UPDATE_SUCCESS = 'updated'
CREATE_SUCCESS = 'created'



@api_view(['PUT',])
def api_update_post_view(request, slug):

	try:
		post = Post.objects.get(slug=slug)
	except Post.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'PUT':
		serializer = PostsSerializer(post, data=request.data)
		data = {}
		if serializer.is_valid():
			serializer.save()
			data[SUCCESS] = UPDATE_SUCCESS
			return Response(data=data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE',])
def api_delete_post_view(request, slug):

	try:
		post = Post.objects.get(slug=slug)
	except Post.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'DELETE':
		operation = post.delete()
		data = {}
		if operation:
			data[SUCCESS] = DELETE_SUCCESS
		return Response(data=data)


class PostListAPIViewNewest(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    def get_queryset(self):

        return Post.objects.filter(private=False).order_by('-posted_at')

class PostListAPIViewOldest(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    def get_queryset(self):

        return Post.objects.filter(private=False).order_by('posted_at')

class PostDetailAPIView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer

# Orders the post from closest to furthest
class PostsNearestOrderViewSet(ListAPIView):
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]    
    
    def get_queryset(self):
        lat = self.kwargs.get('lat')
        long = self.kwargs.get('long')

        user_location = Point(float(long), float(lat), srid=4326)
        filtered_posts = Post.objects.annotate(distance=Distance('locat', user_location)
        ).order_by('distance')

        return filtered_posts
    


# returns all of the posts in a given radius of a given location, orderd by closest to furthest
class PostsRadiusViewSet(ListAPIView):
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]    
    
    def get_queryset(self):
        radius = (int)(self.kwargs.get('radius'))
        lat = (float)(self.kwargs.get('lat'))
        long = (float)(self.kwargs.get('long'))
        
        degrees = radius/ 111.325
        kilom = radius*1000
        user_location = Point(float(long), float(lat), srid=4326)

        filtered_posts = Post.objects.filter(locat__distance_lte=(user_location, 
                        D(m=kilom))).annotate(distance=Distance("locat", user_location)).order_by("distance")

        return filtered_posts

#Filter all the likes for a given post
class LikesPostViewSet(ListAPIView):
    queryset = Like.objects.all()
    serializer_class = LikesViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Like.objects.all()
        postid = self.kwargs['post']
        if postid is not None:
            return Like.objects.filter(post__id=postid)
        else:
            return queryset

#Search all of the comments for anything within specified field
# http://127.0.0.1:8000/api/comments/?search=3&search_fields=post__id
class CommentsAPIView(ListAPIView):
    filter_backends = (DynamicSearchFilter,)
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer

#Filter all the comments for a given post 
# http://127.0.0.1:8000/api/posts/comments/2/
class CommentsPostViewSet(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        postid = self.kwargs['post']
        return Comment.objects.filter(post__id=postid)
        
# Returns all of the posts made by a specific user
class UserPostAPIView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        userid = self.kwargs['user']
        return Post.objects.filter(user=userid)

# Returns all of the comments on a specific post
class CommentPostAPIView(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.all()
        postid = self.kwargs['post']
        if postid is not None:
            return Comment.objects.filter(post__id=postid)

class PostsDeleteViewSet(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class PostsUpdateViewSet(UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostUpdatePropertiesSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class PostsCreateViewSet(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikesCreateViewSet(CreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikesCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikesDeleteViewSet(DestroyAPIView):
    queryset = Like.objects.all()
    serializer_class = LikesViewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        req = QueryDict(self.request.body)
        postid = self.kwargs['post']
        return Like.objects.get(user=self.request.user.id, post=postid)
     
class CommentsCreateViewSet(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentsCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

 
class CommentsUpdateViewSet(UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentsUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class CommentsDeleteViewSet(DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class CategoryPostAPIView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        filteredposts = Post.objects.all()
        categories = QueryDict(self.request.body)
        if categories.__contains__('category1'):
            for x in categories:
                
                filteredposts = filteredposts.filter(categories__tag__contains=categories[x])            

        return filteredposts


@api_view(['GET', ])
@permission_classes([])
@authentication_classes([])
def PostsFilterViewSet2(request):

    if request.method == 'GET':

        req = QueryDict(request.body)

        filtered = Post.objects.order_by('-posted_at')


        """Filter for user """
        try:
            userid = (req['user']) 
            filtered = filtered.filter(user=userid)
        except:
            pass

        """ Filter by Category """
        try:
            for x in req:
                if (x.startswith('category')):
                    filtered = filtered.filter(categories__tag__contains=req[x]) 
        except:
            pass

        

        """ Ordering from neaerest to furthest """
        try:
            lat = (float)(req['Latitude']) 
            long = (float)(req['Longitude'])          
             
            user_location = Point(long, lat, srid=4326)
            filtered =  filtered.annotate(distance=Distance('locat', user_location)
            ).order_by('distance')

            """ Filtering all posts within radius """
            try:
                radius = (int)(req['radius'])  
                degrees = radius/ 111.325
                kilom = radius*1000
                
                filtered = filtered.filter(locat__distance_lte=(user_location, 
                                D(m=kilom))).annotate(distance=Distance("locat", user_location)).order_by("distance")
            except:
                pass
        except:
            pass

        """ Filter for given month and year """
        try:
            given_month = (int)(req['month'])          
            given_year = (int)(req['year'])  

            start = date(given_year, given_month, 1)
            if given_month == 12:
                end = date(given_year+1, 1, 1)
            else:
                end = date(given_year, given_month+1, 1)

            filtered = filtered.filter(posted_at__range=[start, end])
        except :
            pass

        """ If specified, order according to specified ordering """
        try:
            ordering = given_month = (str)(req['order'])
            if (ordering == "newest"):
                filtered = filtered.filter().order_by('-posted_at')
            elif (ordering == "oldest"):
                filtered = filtered.filter().order_by('posted_at')
        except:
            pass

        #return filtered
        response_data = {}
        response_data['result'] = 'Success'
        response_data['count'] = filtered.count()
        response_data['message'] = serializers.serialize('json', filtered["fields"])

        return Response(response_data)

class PostsFilterViewSet(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):

        filtered = Post.objects.all()
              
        
        """Filter for user """
        try:
            userid = self.request.query_params.get('user', None)
            filtered = filtered.filter(user=userid)
        except:
            pass

        """ Filter by Category """
        try:
            filtered = filtered.filter(categories__tag__contains=self.request.query_params.get("category0", None)) 
        except:
            pass

        try:
            filtered = filtered.filter(categories__tag__contains=self.request.query_params.get("category1", None)) 
        except:
            pass
        
        try:
            filtered = filtered.filter(categories__tag__contains=self.request.query_params.get("category2", None)) 
        except:
            pass

        try:
            filtered = filtered.filter(categories__tag__contains=self.request.query_params.get("category3", None)) 
        except:
            pass

        """ Ordering from neaerest to furthest """
        try:
            lat = (float)(self.request.query_params.get('Latitude', None)) 
            long = (float)(self.request.query_params.get('Longitude', None))          
             
            user_location = Point(long, lat, srid=4326)
            filtered =  filtered.annotate(distance=Distance('locat', user_location)
            ).order_by('distance')

            """ Filtering all posts within radius """
            try:
                radius = (int)(self.request.query_params.get('radius', None))  
                degrees = radius/ 111.325
                kilom = radius*1000
                
                filtered = filtered.filter(locat__distance_lte=(user_location, 
                                D(m=kilom))).annotate(distance=Distance("locat", user_location)).order_by("distance")
            except:
                pass
        except:
            pass

        """ Filter for given month and year """
        try:
            given_month = (int)(self.request.query_params.get('month', None))          
            given_year = (int)(self.request.query_params.get('year', None))  

            start = date(given_year, given_month, 1)
            if given_month == 12:
                end = date(given_year+1, 1, 1)
            else:
                end = date(given_year, given_month+1, 1)

            filtered = filtered.filter(posted_at__range=[start, end])
        except :
            pass

        """ If specified, order according to specified ordering """
        try:
            ordering = (str)(self.request.query_params.get('order', None))
            if (ordering == "newest"):
                filtered = filtered.filter().order_by('-posted_at')
            elif (ordering == "oldest"):
                filtered = filtered.filter().order_by('posted_at')
        except:
            pass

        return filtered




# Returns all of the posts made by the people a user follows
class FollowingPostsViews(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [permissions.IsAuthenticated]
    usersFollowing = []
    
    def get_queryset(self):
        current_user = self.request.user
        
        followed_people = Followers.objects.filter(user=current_user).values('following')
        return Post.objects.filter(user__in=followed_people) 


