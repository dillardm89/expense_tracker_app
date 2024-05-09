from django.contrib import admin
from .models.category import Category
from .admin_models.category import CategoryAdmin

admin.site.register(Category, CategoryAdmin)
