from datetime import datetime
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    ''' ExpenseSerializer: custom Expense serializer for validating
            data and creating / updating instances of class Expense

        Args:
            ModelSerializer (class): Django generic serializer
                model class
    '''
    category_name = serializers.ReadOnlyField()

    class Meta:
        model = Expense
        fields = '__all__'

    def validate_amount(self, value) -> float:
        # Validate amount to return float number
        amount = float(value)
        return amount

    def validate_spend_date(self, value: datetime) -> datetime:
        # Validate spend_date to remove microseconds from datetime
        spend_date: datetime = value.replace(microsecond=0)
        return spend_date

    def validate_date_created(self, value: datetime) -> datetime:
        # Validate date_created to remove microseconds from datetime
        date_created: datetime = value.replace(microsecond=0)
        return date_created

    def create(self, validated_data) -> Expense:
        # Create new instance of Expense model once data validated
        return Expense.objects.create(**validated_data)

    def partial_update(self, instance, validated_data) -> Expense:
        # Update existing instance of Expense model once data validated
        instance.vendor = validated_data.get('vendor', instance.vendor)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.summary = validated_data.get('description', instance.summary)
        instance.spend_date = validated_data.get(
            'spend_date', instance.spend_date)
        instance.category = validated_data.get('category', instance.category)
        instance.type = validated_data.get('type', instance.type)
        instance.save()
        return instance
