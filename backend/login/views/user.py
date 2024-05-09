from datetime import (datetime, timezone)
from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from ..models.user import User
from ..serializers.user import UserSerializer
from ..functions.user import find_user_by_id
from ..utils.responses import (no_user_found, create_user_failed,
                               invalid_request_body, user_deleted,
                               user_update_failed)


# Custom list of fields to be returned by UserSerializer
RETURN_FIELDS = ['id', 'email', 'username', 'first_name',
                 'last_name', 'email_verified', 'is_admin',
                 'last_login', 'deleted']


class UserViewSet(viewsets.ViewSet):
    ''' UserViewSet: custom User viewsets for handling
            API requests to 'login/users' routes

        Args:
            ViewSet (class): Django generic viewset model class
    '''
    lookup_field = 'id'

    @method_decorator(ensure_csrf_cookie)
    def create(self, request) -> Response:
        ''' create: 'POST' route for 'login/users' to create
                new instance of User model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with User information in
                request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http status
                code
        '''
        try:
            new_user = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        new_user['deleted'] = False
        new_user['last_login'] = datetime.now(
            tz=timezone.utc).replace(microsecond=0)
        new_user['date_created'] = datetime.now(tz=timezone.utc).replace(
            microsecond=0)
        serializer = UserSerializer(data=new_user)
        if not serializer.is_valid():
            return Response({'detail': create_user_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        serializer.save()
        user: dict = serializer.data
        return Response({'detail': user['id']}, status=status.HTTP_200_OK)

    def list(self, request) -> Response:
        ''' list: 'GET' route for 'login/users' to get all
                instances of User model

        Args:
            request (obj): object from client request, no data required

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of UserSerializer
                data containing queryset of User database or error if no
                data found, 'status' integer with standard Http status code
        '''
        queryset: QuerySet[User] = User.objects.filter(deleted=False)
        if len(queryset) == 0:
            return Response({'detail': no_user_found},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(queryset, fields=RETURN_FIELDS, many=True,
                                    context={'request': self.request})
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    def retrieve(self, request, *args, **kwargs) -> Response:
        ''' get_user: 'GET' route for 'login/users/:id'
                to return a specific User instance

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of UserSerializer
                data containing User instance or error if no data found,
                'status' integer with standard Http status code
        '''
        userId: str = kwargs.get('id')
        response = find_user_by_id(userId)
        if response[1] == status.HTTP_404_NOT_FOUND:
            return Response({'detail': no_user_found},
                            status=status.HTTP_404_NOT_FOUND)
        user: User = response[0]
        if user.deleted:
            return Response({'detail': user_deleted, 'user': ''},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, fields=RETURN_FIELDS,
                                    context={'request': self.request})
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    def partial_update(self, request, *args, **kwargs) -> Response:
        ''' partial_update: 'PATCH' route for 'login/users/:id'
                to update selected field(s) for a specific User instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with field(s) to be
                updated in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http status
                code
        '''
        userId: str = kwargs.get('id')
        response = find_user_by_id(userId)
        if response[1] == status.HTTP_404_NOT_FOUND:
            return Response({'detail': no_user_found},
                            status=status.HTTP_404_NOT_FOUND)
        user: User = response[0]
        try:
            new_data = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            if user.deleted and (new_data['deleted'] is not False):
                return Response({'detail': user_deleted},
                                status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            pass

        try:
            if request.data['date_created']:
                return Response({'detail': invalid_request_body},
                                status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            pass

        serializer = UserSerializer(user, data=new_data,
                                    partial=True)
        if not serializer.is_valid():
            return Response({'detail': user_update_failed},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        user: dict = serializer.data
        return Response({'detail': user['id']},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    def remove(self, request, *args, **kwargs) -> Response:
        ''' remove: 'DELETE' route for 'login/users/:id'
                to delete a specific User instance

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message, 'status' integer with standard Http
                status code
        '''
        userId: str = kwargs.get('id')
        response = find_user_by_id(userId)
        if response[1] == status.HTTP_404_NOT_FOUND:
            return Response({'detail': no_user_found},
                            status=status.HTTP_404_NOT_FOUND)

        user: User = response[0]
        user.delete()
        return Response({'detail': user_deleted}, status=status.HTTP_200_OK)
