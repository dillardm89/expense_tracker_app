from django.db import models
from rest_framework.routers import DefaultRouter


class CustomDateTimeField(models.DateTimeField):
    ''' CustomDateTimeField: custom DateTimeField class that
            stores and displays value without microseconds

        Args:
            DateTimeField (class): Django generic date time field model class
    '''

    def value_to_string(self, obj) -> str:
        val = self.value_from_object(obj)
        if val:
            val.replace(microsecond=0)
            return val.isoformat()
        return ''


class OptionalSlashRouter(DefaultRouter):
    ''' OptionalSlashRouter: custom DefaultRouter class that
            makes all trailing slashes optional in the URLs
            used by the viewsets

        Args:
            DefaultRouter (class): Django generic default
                router model class
    '''

    def __init__(self, *args, **kwargs):
        super(DefaultRouter, self).__init__(*args, **kwargs)
        self.trailing_slash = '/?'
