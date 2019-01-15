from rest_framework import serializers
from head_count.models import Snack, SnackDayMapping


class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = ('id', 'name', 'default_price', 'image_name', 'image_url', 'is_active')


class SnackDayMappingSerializer(serializers.ModelSerializer):
    snack_name = serializers.SerializerMethodField()

    class Meta:
        model = SnackDayMapping
        fields = ('id', 'snack_name', 'date')

    @classmethod
    def get_snack_name(cls, obj):
        name = ''
        if obj.snack_for_day:
            name = obj.snack_for_day.name
        return name
