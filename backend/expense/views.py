from datetime import (datetime, timezone)
from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Expense
from .serializers import ExpenseSerializer
from .functions.views_functions import (find_expense_by_id,
                                        find_expenses_by_user,
                                        find_expenses_by_category,
                                        get_expenses_by_range)
from .functions.import_functions import decode_data_file
from login.utils.responses import invalid_request_body
from .utils.responses import (no_expense_found, expense_deleted,
                              expense_update_failed, create_expense_failed,
                              bulk_create_failed, bulk_create_success)


class ExpenseViewSet(viewsets.ViewSet):
    ''' ExpenseViewSet: custom Expense viewsets for handling
            API requests to 'expense/expenses' routes

        Args:
            ViewSet (class): Django generic viewset model class
    '''
    lookup_field = 'id'

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def add_expense(self, request) -> Response:
        ''' add_expense: 'POST' route for 'expense/expenses/add_expense'
                to create new instance of Expense model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with expense information and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message or new expense id if status=200, 'status'
                integer with standard Http status code
        '''
        try:
            new_expense = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        new_expense['date_created'] = datetime.now(tz=timezone.utc).replace(
            microsecond=0)
        serializer = ExpenseSerializer(data=new_expense)
        if not serializer.is_valid():
            return Response({'detail': create_expense_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        serializer.save()
        expense: dict = serializer.data
        return Response({'detail': expense['id']},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def bulk_create(self, request) -> Response:
        ''' bulk_create: 'POST' route for 'expense/expenses/bulk_create'
                to bulk create multiple new instances of Expense model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'expense_file', which is
                a base64 encoded string of the expenses data, 'has_heading'
                boolean and 'user' id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string of human-readable
                response message or new expense id if status=200, 'status'
                integer with standard Http status code
        '''
        try:
            data_file = request.data['expense_file']
            has_heading = request.data['has_heading']
            userId = request.data['user']
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        response = decode_data_file(data_file, has_heading, userId)
        if response[1] != 200:
            return Response({'detail': bulk_create_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        return Response({'detail': bulk_create_success},
                        status=status.HTTP_200_OK)

    def list(self, request) -> Response:
        ''' list: 'GET' route for 'expense/expenses' to get all
                instances of Expense model

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                ExpenseSerializer data containing queryset of Expense
                database or error if no data found, 'status' integer with
                standard Http status code
        '''
        queryset: QuerySet[Expense] = Expense.objects.all()
        if len(queryset) == 0:
            return Response({'detail': no_expense_found},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = ExpenseSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def user_expenses(self, request) -> Response:
        ''' user_expenses: 'POST' route for 'expense/expenses/user_expenses' to
                get all instances of Expense model associated to a specific
                User instance by foreign key for either the current
                month or all time

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'user' id
                and 'type' ('current' or 'all') in request.data


        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                ExpenseSerializer data containing queryset of Expense
                database or error if no data found, 'status' integer with
                standard Http status code
        '''
        try:
            userId: str = request.data['user']
            type: str = request.data['type']
            response = find_expenses_by_user(userId, type)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Expense] = response[0]
        serializer = ExpenseSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def export_expenses(self, request) -> Response:
        ''' export_expenses: 'POST' route for
                'expense/expenses/export_expenses' to
                get all instances of Expense model associated to a specific
                User instance by foreign key for specific date range

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'user' id, as well as
                'start_date' and 'end_date' for date range


        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                comma delimited Expense database queryset or error
                if no data found, 'status' integer with
                standard Http status code
        '''
        try:
            userId: str = request.data['user']
            start_date: str = request.data['start_date']
            end_date: str = request.data['end_date']
            response = get_expenses_by_range(userId, start_date, end_date)
            if response[1] != status.HTTP_200_OK:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Expense] = response[0]
        serializer = ExpenseSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def category_expenses(self, request) -> Response:
        ''' category_expenses: 'POST' route for
                'expense/expenses/category_expenses' to
                get all instances of Expense model associated to a specific
                Category instance by foreign key and User instance by
                foreign key for either the current month or all time

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'user' id, 'category_id',
                and 'type' ('current' or 'all') in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                ExpenseSerializer data containing queryset of Expense
                database or error if no data found, 'status' integer
                with standard Http status code
        '''
        try:
            userId: str = request.data['user']
            categoryId: str = request.data['category_id']
            type: str = request.data['type']
            response = find_expenses_by_category(categoryId, userId, type)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Expense] = response[0]
        serializer = ExpenseSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def get_expense(self, request) -> Response:
        ''' get_expense: 'POST' route for 'expense/expenses/get_expense'
                to return a specific expense instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'expense_id' and 'user'
                id in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                ExpenseSerializer data containing Expense instance
                or error if no data found, 'status' integer with
                standard Http status code
        '''
        try:
            expenseId: str = request.data['expense_id']
            response = find_expense_by_id(expenseId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        expense: Expense = response[0]
        serializer = ExpenseSerializer(expense)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['patch'], detail=False)
    def update_expense(self, request) -> Response:
        ''' update_expense: 'PATCH' route for 'expense/expenses/update_expense'
                to update selected field(s) for a specific Expense instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'expense_id', 'user' id,
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
            expenseId: str = request.data['expense_id']
            response = find_expense_by_id(expenseId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        expense: Expense = response[0]
        serializer = ExpenseSerializer(expense, data=request.data,
                                       partial=True)
        if not serializer.is_valid():
            return Response({'detail': expense_update_failed},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        expense: dict = serializer.data
        return Response({'detail': expense['id']},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['delete'], detail=False)
    def remove_expense(self, request) -> Response:
        ''' remove_expense: 'DELETE' route for
                'expense/expenses/remove_expense' to delete a
                specific Expense instance

        Args:
            request(obj): object from client request, specifically
            must contain a dictionary with a 'expense_id' and 'user'
            id in request.data

        Returns:
            Response(HttpResponse): object containing API response
            information, specifically a 'detail' string of human-readable
            response message, 'status' integer with standard Http
            status code
        '''
        try:
            expenseId: str = request.data['expense_id']
            response = find_expense_by_id(expenseId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        expense: Expense = response[0]
        expense.delete()
        return Response({'detail': expense_deleted},
                        status=status.HTTP_200_OK)
