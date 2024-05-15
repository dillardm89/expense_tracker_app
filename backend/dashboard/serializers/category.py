from datetime import datetime
from rest_framework import serializers
from ..models.category import Category


class CategorySerializer(serializers.ModelSerializer):
    ''' CategorySerializer: custom Category serializer for validating
            data and creating / updating instances of class Category

        Args:
            ModelSerializer (class): Django generic serializer
                model class
    '''
    class Meta:
        model = Category
        fields = '__all__'

    def validate_name(self, value: str) -> str:
        # Validate name to return first letter capitalized each word
        name: str = value.title()
        return name

    def validate_display_color(self, value: str) -> str:
        # Validate display_color to return all uppercase characters
        display_color = value.upper()
        return display_color

    def validate_budget(self, value) -> float:
        # Validate budget to return float number
        budget = float(value)
        return budget

    def validate_date_created(self, value: datetime) -> datetime:
        # Validate date_created to remove microseconds from datetime
        date_created: datetime = value.replace(microsecond=0)
        return date_created

    def create(self, validated_data) -> Category:
        # Create new instance of Category model once data validated
        return Category.objects.create(**validated_data)

    def update(self, instance, validated_data) -> Category:
        # Update existing instance of Category model once data validated
        instance.name = validated_data.get('name', instance.name)
        instance.display_color = validated_data.get(
            'display_color', instance.display_color)
        instance.budget = validated_data.get('budget', instance.budget)
        instance.save()
        return instance
