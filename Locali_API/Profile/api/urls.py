from django.urls import path
from Profile.api.views import *
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt import views as jwt_views
from django.conf.urls import url
from django.urls import path, include

app_name = 'account-api'

urlpatterns = [
    #path('<str:id>/delete/', UserDeleteViewSet.as_view(), name = "delete-user"),
    url(r'(?P<id>.+)/delete$', UserDeleteViewSet.as_view(), name="delete-user"),
    path('register/', api_registration_view, name="register"),
    path('login/', api_ObtainAuthTokenView.as_view(), name="login"),
    path('does_user_exist/', api_does_user_exist_view, name="does_user_exist"),
    path('properties/', api_account_properties_view, name="properties"),
    path('properties/update/', api_update_account_view, name="update"),
    path('change_password/', api_ChangePasswordView.as_view(), name="change_password"),

    # JWT Tokens:
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),

    # activate account url:
    path('activate/<str:uidb64>/<str:token>/', activate_account, name="activate_user")
]
