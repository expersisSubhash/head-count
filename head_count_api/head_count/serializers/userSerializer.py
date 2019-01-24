from rest_framework import serializers
from django.contrib.auth.models import User
from head_count.models import UnSubscribedUsers


class UserSerializer(serializers.ModelSerializer):
    unsubscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'is_superuser', 'email', 'unsubscribed')

    def create(self, validated_data):
        obj = User.objects.create(**validated_data)
        obj.set_password(self.context['pwd'])
        obj.save()
        return obj

    @classmethod
    def get_unsubscribed(cls, obj):
        unsubscribed = False
        if obj:
            qs = UnSubscribedUsers.objects.filter(user=obj)
            if len(qs) > 0:
                unsubscribed = True
        return unsubscribed
