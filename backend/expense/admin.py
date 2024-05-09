from django.contrib import admin
from .models import Expense


class ExpenseAdmin(admin.ModelAdmin):
    ''' ExpenseAdmin: class for Expense model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('vendor', 'user', 'category')
    list_display = ('spend_date', 'vendor', 'category', 'date_created', 'user')
    search_fields = ('name', 'user', 'category')
    readonly_fields = ['date_created', 'user']
    fieldsets = [
        ('Expense Details', {'fields': [
            'spend_date', 'vendor', 'description', 'type', 'amount',
            'category', 'user', 'date_created'
        ]})]


admin.site.register(Expense, ExpenseAdmin)
