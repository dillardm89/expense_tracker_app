from django.contrib import admin
from .models.user import User
from .admin_models.user import UserAdmin


admin.site.register(User, UserAdmin)
