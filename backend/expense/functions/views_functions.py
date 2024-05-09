from datetime import (datetime, timezone)
from django.db.models import QuerySet
from rest_framework import status
from ..models import Expense
from ..serializers import ExpenseSerializer
from ..utils.responses import (no_expense_found, import_csv_failed)


def find_expenses_by_user(userId: str, type: str) -> list:
    ''' find_expenses_by_user: function to get all Expense instance(s)
            associated with specific User instance for either
            current month or all time

        Args:
            userId (str): id for requested User instance
            type (str): either 'current' or 'all' for which expenses
                to retrieve: all time or current month

        Returns:
            list: list containing a queryset of Expense instance(s) or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    if type == 'current':
        current_month: str = str(datetime.now(tz=timezone.utc).month)
        current_year: str = str(datetime.now(tz=timezone.utc).year)
        queryset: QuerySet[Expense] = Expense.objects.filter(
            spend_date__year=current_year,
            spend_date__month=current_month,
            user=userId).order_by('spend_date')
    else:
        queryset: QuerySet[Expense] = Expense.objects.filter(
            user=userId).order_by('spend_date')
    if len(queryset) == 0:
        return [no_expense_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def find_expense_by_id(expenseId: str) -> list:
    ''' find_expense_by_id: function to return Expense instance
            based on query by id field

        Args:
            expenseId (str): id for requested Expense instance

        Returns:
            list: list containing either an instance of Expense class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Expense] = Expense.objects.filter(id=expenseId)
    if len(queryset) == 0:
        return [no_expense_found, status.HTTP_404_NOT_FOUND]
    expense: Expense = queryset[0]
    return [expense, status.HTTP_200_OK]


def find_expenses_by_category(categoryId: str, userId: str, type: str) -> list:
    ''' find_expenses_by_category: function to get all Expense instance(s)
            associated with specific Use instance and Category instance
            for either current month of all time

        Args:
            categoryId (str): id for requested Category instance
            userId (str): id for requested User instance
            type (str): either 'current' or 'all' for which expenses
                to retrieve: all time or current month

        Returns:
            list: list containing a queryset of Expense instance(s) or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    if type == 'current':
        current_month: str = str(datetime.now(tz=timezone.utc).month)
        current_year: str = str(datetime.now(tz=timezone.utc).year)
        queryset: QuerySet[Expense] = Expense.objects.filter(
            spend_date__year=current_year,
            spend_date__month=current_month,
            category=categoryId,
            user=userId).order_by('spend_date')
    else:
        queryset: QuerySet[Expense] = Expense.objects.filter(
            category=categoryId,
            user=userId).order_by('spend_date')

    if len(queryset) == 0:
        return [no_expense_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def get_expenses_by_range(userId: str, start_date: str,
                          end_date: str) -> list:
    ''' get_expenses_by_range: function to get all Expense instance(s)
            associated with specific Use instance and for a
            specific date range

        Args:
            userId (str): id for requested User instance
            start_date (str): ISO format date string for starting range
            end_date (str): ISO format date string for ending range

        Returns:
            list: list containing a queryset of Expense instance(s) or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    start: datetime = datetime.fromisoformat(start_date)
    end: datetime = datetime.fromisoformat(end_date)
    queryset: QuerySet[Expense] = Expense.objects.filter(
        spend_date__gte=str(start), spend_date__lte=str(end),
        user=userId).order_by('spend_date')
    if len(queryset) == 0:
        return [no_expense_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def create_expenses_for_import(new_expenses: list) -> list:
    ''' create_expense_for_import: function to handle creating
            new Expense instance using name from CSV import file

        Args:
            new_expenses (list): list containing expense objects

        Returns:
            list: list containing category ID string for success
                or a human-readable response message if failed,
                and a 'status' integer with standard Http status code
    '''
    success_count: int = 0
    failed_count: int = 0
    for expense in new_expenses:
        serializer = ExpenseSerializer(data=expense)
        if not serializer.is_valid():
            failed_count += 1
        else:
            serializer.save()
            success_count += 1
    message: str = ('Success Count: ' + str(success_count) +
                    ', Failed Count: ' + str(failed_count))
    if success_count == 0:
        return [import_csv_failed, status.HTTP_400_BAD_REQUEST]
    return [message, status.HTTP_200_OK]
