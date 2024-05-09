from django.urls import (path, include)
from login.models.custom import OptionalSlashRouter
from .views import ExpenseViewSet


# Register viewset routes
router = OptionalSlashRouter()
router.register(prefix=r'expenses', viewset=ExpenseViewSet,
                basename='expenses')

app_name = 'expense'

urlpatterns = [
    path('', include((router.urls, app_name), namespace=app_name))
]
