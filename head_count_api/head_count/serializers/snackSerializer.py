from rest_framework import serializers
from head_count.models import Snack


class SnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snack
        fields = ('id', 'name', 'default_price', 'image_name', 'is_active')
