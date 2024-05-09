from django.urls import (path, include)
from .models.custom import OptionalSlashRouter
from .views.user import UserViewSet


# Register viewset routes
router = OptionalSlashRouter()
router.register(prefix=r'users', viewset=UserViewSet, basename='users')

app_name = 'login'

urlpatterns = [
    path('', include((router.urls, app_name), namespace=app_name))
]
