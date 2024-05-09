from django.urls import (path, include)
from login.models.custom import OptionalSlashRouter
from .views.category import CategoryViewSet


# Register viewset routes
router = OptionalSlashRouter()
router.register(prefix=r'categories', viewset=CategoryViewSet,
                basename='categories')

app_name = 'dashboard'

urlpatterns = [
    path('', include((router.urls, app_name), namespace=app_name))
]
