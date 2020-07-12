from rest_auth.registration.views import (
    SocialAccountListView, SocialAccountDisconnectView
)
from django.urls import path, include
from .routers import router
from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt import views as jwt_views
from Profile.api import urls as profile_urls
from Posts.api import urls as post_urls
from Groups.api import urls as group_urls
from Friends.api import urls as friend_urls
from rest_framework_swagger.views import get_swagger_view
from rest_framework.documentation import include_docs_urls
from .views import *
from django.urls import re_path


schema_view = get_swagger_view(title='Polls API')


urlpatterns = [
    # Testing
    path('grouping/', include(group_urls)),
    path('relationship/', include(friend_urls)),

    # ListView of Models
    path('', include(router.urls)),

    # CRUD API Endpoints for posts, comments and likes
    path('posts/', include(post_urls)),

    # Account API Endpoints for Register, Login etc
    path('account/', include(profile_urls, namespace='account-api')),

    # django-rest-auth for social authentication
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    url(r'^rest-auth/facebook/connect/$', FacebookConnect.as_view(), name='fb_connect'),
    url(r'^rest-auth/twitter/connect/$', TwitterConnect.as_view(), name='twitter_connect'),
    url(r'^rest-auth/twitter/$', TwitterLogin.as_view(), name='twitter_login'),
    # url(r'^rest-auth/github/$', GitHubLogin.as_view(), name='github_login'),
    # url(r'^rest-auth/github/connect/$', GithubConnect.as_view(), name='github_connect'),
    url(r'^socialaccounts/$', SocialAccountListView.as_view(), name='social_account_list'),
    url(r'^socialaccounts/(?P<pk>\d+)/disconnect/$', SocialAccountDisconnectView.as_view(), name='social_account_disconnect'),

    # Swagger API docs
    path(r'swagger-docs/', schema_view),

    # coreapi for API documentation
    path(r'docs/', include_docs_urls(title='Polls API')),

]
