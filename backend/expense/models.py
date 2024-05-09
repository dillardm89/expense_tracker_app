import uuid
from decimal import Decimal
from django.core.validators import (MinLengthValidator, MaxLengthValidator,
                                    MinValueValidator, MaxValueValidator)
from django.db import models
from login.models.custom import CustomDateTimeField
from login.models.user import User
from dashboard.models.category import Category


class Expense(models.Model):
    ''' Expense: custom Expense model associated to
            User model by foreign key

        Args:
            Model (class): Django generic model class
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, blank=False, null=False,
                             on_delete=models.CASCADE,
                             related_name='expenses')
    category = models.ForeignKey(Category, blank=False, null=True,
                                 on_delete=models.SET_NULL,
                                 related_name='expenses')
    vendor = models.CharField(
        max_length=100, blank=False, null=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.')),
                    MaxLengthValidator(limit_value=50,
                                       message=('Must not exceed 100 ' +
                                                'characters.'))])
    description = models.CharField(
        max_length=250, blank=True, null=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.')),
                    MaxLengthValidator(limit_value=250,
                                       message=('Must not exceed 250 ' +
                                                'characters.'))])
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=False, null=False,
        validators=[MinValueValidator(
            limit_value=Decimal('0.01'),
            message=('Positive number required.'))])
    type = models.SmallIntegerField(
        blank=False, null=False,
        validators=[
            MinValueValidator(
                limit_value=0,
                message=('Value must be: 0 (Deposit) or 1 (Withdrawal)')),
            MaxValueValidator(
                limit_value=1,
                message=('Value must be: 0 (Deposit) or 1 (Withdrawal)'))])
    spend_date = CustomDateTimeField(blank=False, null=False)
    date_created = CustomDateTimeField(blank=False, null=False)

    def get_display_string(self) -> str:
        spend_date_string: str = self.spend_date.strftime('%m-%d-%Y')
        amount_string: str = '$' + str(self.amount)
        vendor_short_string: str = self.vendor
        if len(self.vendor) > 10:
            vendor_short_string = self.vendor[0:11]
        display_string: str = spend_date_string + ' ' + \
            vendor_short_string + ' ' + amount_string
        return display_string

    @property
    def category_name(self):
        return self.category.name

    def __str__(self) -> str:
        return self.get_display_string()

    class Meta:
        verbose_name_plural = 'Expenses'
        db_table = 'expense_expenses'
