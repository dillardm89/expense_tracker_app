from datetime import datetime
from ..models.user import User
from .custom import DynamicFieldsModelSerializer


class UserSerializer(DynamicFieldsModelSerializer):
    ''' UserSerializer: custom User serializer for validating
            data and creating / updating instances of class User

        Args:
            DynamicFieldsModelSerializer (class):  custom serializer
                class that takes an additional `fields` argument to
                controls which fields should be returned by serializer
    '''
    class Meta:
        model = User
        fields = '__all__'

    def validate_email(self, value: str) -> str:
        # Validate email to return lowercase string
        email: str = value.lower()
        return email

    def validate_username(self, value: str) -> str:
        # Validate username to return lowercase string
        username: str = value.lower()
        return username

    def validate_first_name(self, value: str) -> str:
        # Validate first_name to return properly capitalized string
        first_name: str = value.capitalize()
        return first_name

    def validate_last_name(self, value: str) -> str:
        # Validate last_name to return properly capitalized string
        last_name: str = value.capitalize()
        return last_name

    def validate_last_login(self, value: datetime) -> datetime:
        # Validate last_login to remove microseconds from datetime
        last_login: datetime = value.replace(microsecond=0)
        return last_login

    def validate_date_created(self, value: datetime) -> datetime:
        # Validate date_created to remove microseconds from datetime
        date_created: datetime = value.replace(microsecond=0)
        return date_created

    def create(self, validated_data) -> User:
        # Create new instance of User model once data validated
        return User.objects.create(**validated_data)

    def partial_update(self, instance, validated_data) -> User:
        # Update existing instance of User model once data validated
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.email_verified = validated_data.get(
            'email_verified', instance.email_verified)
        instance.password = validated_data.get('password', instance.password)
        instance.last_login = validated_data.get(
            'last_login', instance.last_login)
        instance.is_admin = validated_data.get('is_admin', instance.is_admin)
        instance.deleted = validated_data.get('deleted', instance.is_admin)
        instance.save()
        return instance
