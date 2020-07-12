from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views 

from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from Profile import views as user_views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    # path('jet/', include('jet.urls', 'jet')),
    # path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('doc/', schema_view),
    path('api/', include('api.urls')),
    path('register/', user_views.register, name='register'),
    path('profile/', user_views.profile, name='user-profile'),
    #path('', include('Posts.urls')),
    path('', user_views.register, name='register'),
    path('posts/', include('Posts.urls')),

    # class based views
    #TODO: add LoginView, LogoutView, PasswordResetView, PasswordResetConfirmView, PasswordResetCompleteView in Profile/views.py for our auth model 

    path('login/', auth_views.LoginView.as_view(template_name='Profile/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='Profile/logout.html'), name='logout'),
    path('profile/password-reset/', auth_views.PasswordResetView.as_view(template_name='Profile/password_reset.html'), name='password_reset'),
    path('password-reset/done', auth_views.PasswordResetDoneView.as_view(template_name='Profile/password_reset_done.html'), name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(template_name='Profile/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(template_name='Profile/password_reset_complete.html'), name='password_reset_complete'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
