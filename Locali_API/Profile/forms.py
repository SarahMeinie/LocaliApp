from django import forms
from .models import User as CustomUser
from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm


class UserRegisterForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'username', 'password1', 'password2']


class UserSignUpForm(UserCreationForm):
    # email = forms.EmailField(max_length=100, help_text='Required')
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')


# update username and email from profile page
# TODO
class UserUpdateForm(forms.ModelForm):  
    class Meta:
        model = CustomUser
        fields = ['username', 'email']


# update profile pic from profile page
class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['image']
