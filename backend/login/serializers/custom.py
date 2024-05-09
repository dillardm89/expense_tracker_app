from rest_framework import serializers


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    ''' DynamicFieldsModelSerializer: custom serializer class that
            takes an additional `fields` argument to controls which
            fields should be returned by serializer

        Args:
            ModelSerializer (class): Django generic serializer
                model class
    '''

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
