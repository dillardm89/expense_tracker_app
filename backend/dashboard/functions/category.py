import re
from datetime import (datetime, timezone)
from django.db.models import QuerySet
from rest_framework import status
from ..models.category import Category
from ..serializers.category import CategorySerializer
from ..utils.responses import (no_category_found,
                               create_category_failed)


def find_categories_by_user(userId: str) -> list:
    ''' find_categories_by_user: function to get all Category instance(s)
            associated with specific User instance

        Args:
            userId (str): id for requested User instance

        Returns:
            list: list containing a queryset of Category instance(s) or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Category] = Category.objects.filter(
        user=userId).order_by('name')
    if len(queryset) == 0:
        return [no_category_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def find_category_by_id(categoryId: str) -> list:
    ''' find_categories_by_id: function to return Category instance
            based on query by id field

        Args:
            categoryId (str): id for requested Category instance

        Returns:
            list: list containing either an instance of Category class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Category] = Category.objects.filter(id=categoryId)
    if len(queryset) == 0:
        return [no_category_found, status.HTTP_404_NOT_FOUND]
    category: Category = queryset[0]
    return [category, status.HTTP_200_OK]


def find_category_by_name(category_name: str, userId: str) -> list:
    ''' find_category_by_name: function to return Category instance
            based on query by exact name field for a specific User instance

        Args:
            category_name (str): name for requested Category instance
            userId (str): id for specific User instance

        Returns:
            list: list containing either an instance of Category class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Category] = Category.objects.filter(
        name=category_name, user=userId)
    if len(queryset) == 0:
        return [no_category_found, status.HTTP_404_NOT_FOUND]
    category: Category = queryset[0]
    return [category, status.HTTP_200_OK]


def find_category_by_similar_name(category_name: str, userId: str) -> list:
    ''' find_category_by_similar_name: function to return Category instance
            based on query for similar name field for a specific User instance

        Args:
            category_name (str): name for requested Category instance
            userId (str): id for specific User instance

        Returns:
            list: list containing either an instance of Category class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    name: str = category_name.title()
    name.replace('-', ' ')
    and_string: int = name.find('and')
    if and_string != -1:
        name = name.replace('and', '')

    name_list: list = re.findall(r"\w+", name)
    name_list.insert(0, name)
    user_queryset: QuerySet[Category] = Category.objects.filter(user=userId)
    if len(user_queryset) == 0:
        return [no_category_found, status.HTTP_404_NOT_FOUND]

    name_queryset: QuerySet[Category] = []
    for string in name_list:
        name_queryset = user_queryset.filter(name__icontains=string)
        if len(name_queryset) > 0:
            category: Category = name_queryset[0]
            return [category, status.HTTP_200_OK]
    if len(name_queryset) == 0:
        return [no_category_found, status.HTTP_404_NOT_FOUND]


def get_category_id(category_name: str, userId: str) -> str | None:
    ''' get_category_id: function to handle searching for category
            by similar name or creating new category if no matches

        Args:
            category_name (str): name for requested Category instance
            userId (str): id for specific User instance

        Returns:
            categoryId (str): new or matching id for Category instance
    '''
    categoryId: str | None = None
    response = find_category_by_similar_name(category_name, userId)
    if response[1] == 200:
        categoryId = response[0].id
    else:
        result = create_category_for_import(category_name, userId)
        if result[1] == 200:
            categoryId = result[0]
    return categoryId


def create_category_for_import(name: str, userId: str) -> list:
    ''' create_category_for_import: function to handle creating
            new Category instance using name from CSV import file

        Args:
            name (str): name for requested Category instance
            userId (str): id for specific User instance

        Returns:
            list: list containing category ID string for success
                or a human-readable response message if failed,
                and a 'status' integer with standard Http status code
    '''
    new_category: dict = {
        'name': name, 'user': userId, 'display_color': '#FFFFFF',
        'budget': 0, 'type': 1,  # Defaults to 1=Expense
        'date_created': datetime.now(tz=timezone.utc).replace(microsecond=0)
    }
    serializer = CategorySerializer(data=new_category)
    if not serializer.is_valid():
        return [create_category_failed, status.HTTP_400_BAD_REQUEST]
    serializer.save()
    category: dict = serializer.data
    return [category['id'], status.HTTP_200_OK]
