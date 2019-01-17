from rest_framework import serializers
from head_count.models import Snack, SnackDayMapping


class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = ('id', 'name', 'default_price', 'image_name', 'image_url', 'is_active')


class SnackDayMappingSerializer(serializers.ModelSerializer):
    snack_name = serializers.SerializerMethodField()
    snack_id = serializers.SerializerMethodField()

    class Meta:
        model = SnackDayMapping
        fields = ('id', 'snack_id', 'snack_name', 'date', 'price_for_day')

    @classmethod
    def get_snack_name(cls, obj):
        name = ''
        if obj.snack_for_day:
            name = obj.snack_for_day.name
        return name

    @classmethod
    def get_snack_id(cls, obj):
        snack_id = -1
        if obj.snack_for_day:
            snack_id = obj.snack_for_day.id
        return snack_id
