import uuid
from django.db import models
from django.core.validators import (EmailValidator, MinLengthValidator,
                                    MaxLengthValidator)
from .custom import CustomDateTimeField


class User(models.Model):
    ''' User: custom User model

        Args:
            Model (class): Django generic model class
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    email = models.EmailField(
        max_length=254, blank=False, unique=True, null=False,
        validators=[EmailValidator(message='Invalid Email'),
                    MinLengthValidator(limit_value=5,
                                       message=('Must be at least 5 ' +
                                                'characters.')),
                    MaxLengthValidator(limit_value=254,
                                       message=('Must not exceed 254 ' +
                                                'characters.'))],
        error_messages={
            'unique': 'An account with this email already exists.'})
    username = models.CharField(
        max_length=20, blank=False, unique=True,
        validators=[MinLengthValidator(limit_value=5,
                                       message=('Must be at least ' +
                                                '5 characters.')),
                    MaxLengthValidator(limit_value=20,
                                       message=('Must not exceed 20 ' +
                                                'characters.'))],
        error_messages={'unique': 'Username must be unique.'})
    first_name = models.CharField(
        max_length=150, blank=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least 2 ' +
                                                'characters.')),
                    MaxLengthValidator(limit_value=150,
                                       message=('Must not exceed 150 ' +
                                                'characters.'))])
    last_name = models.CharField(
        max_length=150, blank=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least 12 ' +
                                                'characters.')),
                    MaxLengthValidator(limit_value=100,
                                       message=('Must not exceed 100 ' +
                                                'characters.'))])
    email_verified = models.BooleanField(blank=False)
    password = models.CharField(
        max_length=100, blank=False,
        validators=[MinLengthValidator(limit_value=12,
                                       message=('Must be at least 12 ' +
                                                'characters.')),
                    MaxLengthValidator(limit_value=100,
                                       message=('Must not exceed 100 ' +
                                                'characters.'))])
    date_created = CustomDateTimeField(blank=False, null=False)
    last_login = CustomDateTimeField(blank=False, null=False)
    is_admin = models.BooleanField(blank=False, null=False, default=False)
    deleted = models.BooleanField(blank=False, null=False, default=False)

    def __str__(self) -> str:
        return self.email

    class Meta:
        verbose_name_plural = 'Users'
        db_table = 'login_users'
