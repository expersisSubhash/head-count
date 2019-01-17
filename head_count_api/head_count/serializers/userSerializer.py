from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'is_superuser', 'email')

    def create(self, validated_data):
        obj = User.objects.create(**validated_data)
        obj.set_password(self.context['pwd'])
        obj.save()
        return obj




