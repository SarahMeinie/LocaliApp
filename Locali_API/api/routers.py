from Posts import views
from Profile import views as Profile_views
from rest_framework_extensions.routers import NestedRouterMixin
from rest_framework import routers
from Groups import views as GroupView
from Friends.api import views as friends_view

class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass

router = routers.DefaultRouter()
router.register('posts', views.PostsViewSet)
router.register('likes', views.LikesViewSet)
router.register('categories', views.CategoryViewSet)
router.register('followings', friends_view.FriendViewSet)
router.register('group_posts', GroupView.GroupPostsViewSet)
router.register('groups', GroupView.GroupViewSet)
router.register('comments', views.CommentsViewSet)


router.register(r'users', Profile_views.UserViewSet)

