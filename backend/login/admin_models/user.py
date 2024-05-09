from django.contrib import admin


class UserAdmin(admin.ModelAdmin):
    ''' UserAdmin: class for User model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('email', 'username')
    list_display = ('email', 'username', 'first_name',
                    'last_name', 'last_login')
    search_fields = ('email', 'username')
    readonly_fields = ['expense_categories', 'expenses', 'date_created']
    fieldsets = [
        ('User Details', {'fields': [
            'email', 'username', 'first_name', 'last_name', 'password',
            'last_login', 'email_verified', 'is_admin', 'deleted',
            'date_created'
        ]}),
        ('Expense Categories', {'fields': ['expense_categories']}),
        ('User Expenses', {'fields': ['expenses']})]

    def expense_categories(self, obj):
        ''' expense_categories: function to get list of
            categories for specific user

            Args:
                obj (User): Object of class User

            Returns:
                list (category_list): list of 'name' strings for
                categories of class Category associated by
                foreign key to the user
        '''
        categories = obj.categories.all().values()
        category_list = []
        for category in categories:
            category_list.append(category['name'])
        return category_list

    def expenses(self, obj):
        ''' expenses: function to get the number of expenses
            for a specific user

            Args:
                obj (User): Object of class User

            Returns:
                integer (num_expenses): count of the number of expenses
                    of class Expense assiated by foreign key
                    to the category

        '''
        num_expenses = len(obj.expenses.all())
        return num_expenses
