from django.db.models import QuerySet
from rest_framework import status
from ..models.user import User
from ..utils.responses import no_user_found


def find_user_by_id(userId: str) -> list:
    ''' find_user_by_id: function to return User instance
            based on query by id field

        Args:
            userId (str): id for requested User instance

        Returns:
            list: list containing either an instance of User class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[User] = User.objects.filter(id=userId)
    if len(queryset) == 0:
        return [no_user_found, status.HTTP_404_NOT_FOUND]
    user: User = queryset[0]
    return [user, status.HTTP_200_OK]
