from rest_framework import serializers
from head_count.models import SystemPreferences


class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemPreferences
        fields = ('key', 'value')
