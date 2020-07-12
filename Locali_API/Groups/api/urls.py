from django.urls import path
from Groups.views import UsersGroupViewSet, MemberDeleteViewSet, AddMemberViewSet, AddAdminViewSet, GroupDeleteViewSet, GroupAdminsUpdateViewSet, GroupPostsDeleteViewSet, GroupCreateViewSet, GroupPostsCreateViewSet, PostsInGroupViewSet, GroupMembersUpdateViewSet
from django.conf.urls import url

urlpatterns = [
    
    # class based views:  
    url(r'create$', GroupCreateViewSet.as_view(), name="create-group"),
    url(r'(?P<id>\d+)/delete$', GroupDeleteViewSet.as_view(), name="delete-group"),
	url(r'posts/(?P<id>\d+)/delete$', GroupPostsDeleteViewSet.as_view(), name="delete-group-post"),
    url(r'posts/(?P<group>\d+)/group$', PostsInGroupViewSet.as_view(), name="view-groups-posts"),
    url(r'(?P<id>\d+)/update/members$', GroupMembersUpdateViewSet.as_view(), name="update-group-members"),
    url(r'(?P<id>\d+)/update/admins$', GroupAdminsUpdateViewSet.as_view(), name="update-group-admins"),
    url(r'add/member$', AddMemberViewSet.as_view(), name="add-group-member"),
    url(r'add/admin$', AddAdminViewSet.as_view(), name="add-group-admin"),
    url(r'remove/member$', MemberDeleteViewSet.as_view(), name="remove-group-member"),
    url(r'(?P<group>\d+)/user$', UsersGroupViewSet.as_view(), name="users-groups"),
    url(r'posts/createpost$', GroupPostsCreateViewSet.as_view(), name="create-group-post"),
]

