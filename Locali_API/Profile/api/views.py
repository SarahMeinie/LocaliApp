from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, DestroyAPIView
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from Profile.api.serializers import *
from Profile.Serializers import UserSerializer
from Profile.models import User
from rest_framework.authtoken.models import Token
from django.http.request import QueryDict
from rest_framework import permissions

# email verification imports:
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from Profile.forms import UserSignUpForm
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from Profile.api.token_generator import account_activation_token
from django.core.mail import EmailMessage, send_mail


# Register
# URL ENDPOINT:     https://<your-domain>/api/account/register/
# BODY:             [Keys: email, username, password, password2] (form-data OR x-www-form-urlencoded)
@api_view(['POST', ])
@permission_classes([])
@authentication_classes([])
def api_registration_view(request):

    if request.method == 'POST':
        data = {}

        email = request.data.get('email', '0').lower()
        if validate_email(email) != None:
            data['error_message'] = 'That email is already in use'
            data['response'] = 'Error'
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        req = QueryDict(request.body)
        print(req)
        username = request.data.get('username', '0')
        if validate_username(username) != None:
            data['error_message'] = 'That username is already in use'
            data['response'] = 'Error'
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            data['response'] = 'Successfully registered new user'
            data['username'] = user.username
            data['email'] = user.email
            data['id'] = user.id
            token = Token.objects.get(user=user).key
            data['token'] = token

            # send account activation email:
            activation_email(request, user)

            Response(data, status=status.HTTP_201_CREATED)
        else:
            data = serializer.errors
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        return Response(data)


# Email Activation - send activation email
def activation_email(request, user):
    current_site = get_current_site(request)
    email_subject = 'Activate Your Locali Account'
    message = render_to_string('email_activate_account.html', {
        'user': user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    })
    to_email = user.email
    email = EmailMessage(email_subject, message, to=[to_email])
    email.send()


# Email Activation - activate email through link
def activate_account(request, uidb64, token):
    try:
        uid = (urlsafe_base64_decode(uidb64)).decode()
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist, UnicodeDecodeError, UnicodeError):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'email_verification_complete.html', {'username': user.username})
    else:
        return render(request, 'email_verification_invalid.html')


def validate_email(email):
    account = None
    try:
        account = User.objects.get(email=email)
    except User.DoesNotExist:
        return None
    if account != None:
        return email


def validate_username(username):
    account = None
    try:
        account = User.objects.get(username=username)
    except User.DoesNotExist:
        return None
    if account != None:
        return username


# User properties
# URL ENDPOINT:     https://<your-domain>/api/account/properties/
# HEADERS:          Authorization: Token <token>
@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def api_account_properties_view(request):

    try:
        account = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserPropertiesSerializer(account)
        return Response(serializer.data)


# User update properties
# URL ENDPOINT:     https://<your-domain>/api/account/properties/update/
# HEADERS:          [Authorization: Token <token>]
# BODY:             [Keys: username(required), email(required), first_name(optional), last_name(optional)] (form-data OR x-www-form-urlencoded)
@api_view(['PUT', ])
@permission_classes((IsAuthenticated, ))
def api_update_account_view(request):

    try:
        user = request.user
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserUpdatePropertiesSerializer(user, data=request.data)
        data = {}

        if serializer.is_valid():
            serializer.save()
            data['response'] = 'User update success'
            return Response(data=data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login
# URL ENDPOINT:     http://127.0.0.1:8000/api/account/login/
# BODY:             [Keys: username, password] (form-data OR x-www-form-urlencoded)
class api_ObtainAuthTokenView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        context = {}

        username = request.data.get('username')
        password = request.data.get('password')

        account = authenticate(username=username, password=password)
        if account:
            try:
                token = Token.objects.get(user=account)
            except Token.DoesNotExist:
                token = Token.objects.create(user=account)
            context['response'] = 'Authentication successful'
            context['username'] = account.username
            context['email'] = account.email.lower()
            context['id'] = account.id
            context['token'] = token.key
            return Response(context, status=status.HTTP_202_ACCEPTED)
        else:
            context['response'] = 'Error'
            context['error_message'] = 'Invalid username and/or password'
            context['username'] = request.data.get('username')
            context['password'] = request.data.get('password')
            return Response(context, status=status.HTTP_401_UNAUTHORIZED)

        return Response(context)


# Check if User exists
# URL ENDPOINT:     http://127.0.0.1:8000/api/account/does_user_exist/
# BODY:             [Keys: username] (x-www-form-urlencoded)
@api_view(['GET', ])
@permission_classes([])
@authentication_classes([])
def api_does_user_exist_view(request):

    if request.method == 'GET':
        data = QueryDict(request.body)
        if data.__contains__('username'):
            username = data['username']
        else:
            username = False
        data = {}
        try:
            user = User.objects.get(username=username)
            data['response'] = "User exists"
            data['id'] = user.id
            data['username'] = user.username
            data['email'] = user.email
            data['is_active'] = user.is_active
        except User.DoesNotExist:
            data['response'] = "User does not exist"
        return Response(data)


# Change user password
# URL ENDPOINT:     http://127.0.0.1:8000/api/account/change_password/
# HEADERS:          [Authorization: Token <token>]
# BODY:             [Keys: old_password, new_password, confirm_new_password) (form-data OR x-www-form-urlencoded)
class api_ChangePasswordView(UpdateAPIView):

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            # confirm the new passwords match
            new_password = serializer.data.get("new_password")
            confirm_new_password = serializer.data.get("confirm_new_password")
            if new_password != confirm_new_password:
                return Response({"new_password": ["New passwords must match"]}, status=status.HTTP_400_BAD_REQUEST)

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"response": "successfully changed password"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE', ])
@permission_classes([])
@authentication_classes([])
def del_user(request):
    data = {}
    if request.method == 'DELETE':
        try:
            username = self.kwargs.get('username')
            u = User.objects.get(username=username)
            u.delete()
            data['response'] = "Deleted User successfully"

        except User.DoesNotExist:
            data['response'] = "User does not exist"
    else:
        data['response'] = "This should be a DEL request."

    return Response(data)


class UserDeleteViewSet(DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
