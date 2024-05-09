from datetime import (datetime, timezone)
from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from ..models.category import Category
from ..serializers.category import CategorySerializer
from ..functions.category import (find_category_by_id,
                                  find_categories_by_user,
                                  find_category_by_name)
from login.utils.responses import invalid_request_body
from ..utils.responses import (no_category_found, category_deleted,
                               category_update_failed, create_category_failed,
                               category_exists)


class CategoryViewSet(viewsets.ViewSet):
    ''' CategoryViewSet: custom Category viewsets for handling
            API requests to 'dashboard/categories' routes

        Args:
            ViewSet (class): Django generic viewset model class
    '''
    lookup_field = 'id'

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def add_category(self, request) -> Response:
        ''' add_category: 'POST' route for 'dashboard/categories/add_category'
            to create new instance of Category model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with Category information and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message or new category id if status=200, 'status'
                integer with standard Http status code
        '''
        try:
            new_category = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        new_category['date_created'] = datetime.now(tz=timezone.utc).replace(
            microsecond=0)
        serializer = CategorySerializer(data=new_category)
        if not serializer.is_valid():
            return Response({'detail': create_category_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        serializer.save()
        category: dict = serializer.data
        return Response({'detail': category['id']},
                        status=status.HTTP_200_OK)

    def list(self, request) -> Response:
        ''' list: 'GET' route for 'dashboard/categories' to get all
                instances of Category model

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                CategorySerializer data containing queryset of category
                database or error if no data found, 'status' integer with
                standard Http status code
        '''
        queryset: QuerySet[Category] = Category.objects.all().order_by('name')
        if len(queryset) == 0:
            return Response({'detail': no_category_found},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def user_categories(self, request) -> Response:
        ''' user_categories: 'POST' route for
                'dashboard/categories/user_categories' to
                get all instances of Category model associated to a specific
                User instance by foreign key

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'user' id in request.data


        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                CategorySerializer data containing queryset of category
                database or error if no data found, 'status' integer with
                standard Http status code
        '''
        try:
            userId: str = request.data['user']
            response = find_categories_by_user(userId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Category] = response[0]
        serializer = CategorySerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def get_category(self, request) -> Response:
        ''' get_category: 'POST' route for 'dashboard/categories/get_category'
                to return a specific category instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'category_id' and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                CategorySerializer data containing category instance
                or error if no data found, 'status' integer with standard
                Http status code
        '''
        categoryId: str = request.data['category_id']
        response = find_category_by_id(categoryId)
        if response[1] == status.HTTP_404_NOT_FOUND:
            return Response({'detail': response[0]},
                            status=status.HTTP_207_MULTI_STATUS)
        category: Category = response[0]
        serializer = CategorySerializer(category)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def check_name(self, request) -> Response:
        ''' check_name: 'POST' route for 'dashboard/categories/check_name' to
                determine whether a Category instance exists for specific name
                and specific User

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'category_name' and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http
                status code
        '''
        try:
            category_name: str = request.data['category_name']
            userId: str = request.data['user']
            response = find_category_by_name(category_name, userId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': no_category_found},
                                status=status.HTTP_207_MULTI_STATUS)
            else:
                return Response({'detail': category_exists},
                                status=response[1])
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['patch'], detail=False)
    def update_category(self, request) -> Response:
        ''' update_category: 'PATCH' route for
                'dashboard/categories/update_category'
                to update selected field(s) for a specific category instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'category_id', 'user' id,
                and field(s) to be updated in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http status
                code
        '''
        try:
            if request.data['date_created']:
                return Response({'detail': invalid_request_body},
                                status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            pass

        try:
            categoryId: str = request.data['category_id']
            response = find_category_by_id(categoryId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        category: Category = response[0]
        serializer = CategorySerializer(category, data=request.data,
                                        partial=True)
        if not serializer.is_valid():
            return Response({'detail': category_update_failed},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        category: dict = serializer.data
        return Response({'detail': category['id']},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['delete'], detail=False)
    def remove_category(self, request) -> Response:
        ''' remove_category: 'DELETE' route for
            'dashboard/categories/remove_category'
            to delete a specific category instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'category_id' and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http
                status code
        '''
        try:
            categoryId: str = request.data['category_id']
            response = find_category_by_id(categoryId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        category: Category = response[0]
        category.delete()
        return Response({'detail': category_deleted},
                        status=status.HTTP_200_OK)
