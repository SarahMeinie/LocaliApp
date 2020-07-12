from rest_framework import serializers

from Profile.models import User


class RegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {
                'password': {'write_only': True},
        }	


    def	save(self):

        account = User(
                    email=self.validated_data['email'],
                    username=self.validated_data['username']
                )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        account.set_password(password)
        account.save()
        return account


class UserPropertiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'pk', 
            'username', 
            'email',
            'first_name',
            'last_name',
            'image',
            'date_joined',
            'is_active',
            'is_staff',
        ]


class UserUpdatePropertiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)
