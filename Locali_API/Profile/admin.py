from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as Admin
from Profile.models import User

# change the interface display on the admin GUI
class UserAdmin(Admin):
	list_display = ('username', 'email', 'is_staff', 'is_superuser', 'is_active', 'password', 'id')
	search_fields = ('id', 'email','username',)
	readonly_fields=('id', 'date_joined', 'last_login')

	filter_horizontal = ()
	list_filter = ()
	fieldsets = ()


admin.site.register(User, UserAdmin)
