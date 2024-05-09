from django.contrib import admin


class CategoryAdmin(admin.ModelAdmin):
    ''' CategoryAdmin: class for Category model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('name', 'user')
    list_display = ('name', 'budget', 'user', 'expenses', 'date_created')
    search_fields = ('name', 'user')
    readonly_fields = ['date_created', 'user', 'expenses']
    fieldsets = [
        ('Category Details', {'fields': [
            'name', 'budget', 'type', 'display_color', 'date_created',
            'expenses', 'user'
        ]})]

    def expenses(self, obj):
        ''' expenses: function to get the number of expenses
            for a specific category

            Args:
                obj (Category): Object of class Category

            Returns:
                integer (num_expenses): count of the number of expenses
                    of class Expense assiated by foreign key
                    to the category

        '''
        num_expenses = len(obj.expenses.all())
        return num_expenses
