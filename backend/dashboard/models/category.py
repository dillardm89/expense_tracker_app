import uuid
from django.db import models
from django.core.validators import (MinLengthValidator, MaxLengthValidator,
                                    MinValueValidator, MaxValueValidator)
from login.models.custom import CustomDateTimeField
from login.models.user import User


class Category(models.Model):
    ''' Category: custom Category model associated to
            User model by foreign key

        Args:
            Model (class): Django generic model class
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, blank=False, null=False,
                             on_delete=models.CASCADE,
                             related_name='categories')
    name = models.CharField(
        max_length=50, blank=False, null=False, unique=True,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.')),
                    MaxLengthValidator(limit_value=50,
                                       message=('Must not exceed 50 ' +
                                                'characters.'))],
        error_messages={'unique': 'Category name must be unique.'})
    display_color = models.CharField(
        max_length=7, blank=False, null=False,
        validators=[MinLengthValidator(
            limit_value=7, message=('Must be a 7 character hex color ' +
                                    'code (including "#").')),
                    MaxLengthValidator(
            limit_value=7, message=('Must be a 7 character hex color ' +
                                    'code (including "#").'))])
    type = models.SmallIntegerField(
        blank=False, null=False,
        validators=[
            MinValueValidator(
                limit_value=0,
                message=('Value must be: 0 (Income) or 1 (Expense)')),
            MaxValueValidator(
                limit_value=1,
                message=('Value must be: 0 (Income) or 1 (Expense)'))])
    budget = models.DecimalField(max_digits=10, decimal_places=2,
                                 blank=False, null=False)
    date_created = CustomDateTimeField(blank=False, null=False)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'
        db_table = 'dashboard_categories'
