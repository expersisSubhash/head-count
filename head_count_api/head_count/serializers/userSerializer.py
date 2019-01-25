from rest_framework import serializers
from django.contrib.auth.models import User
from head_count.models import UnSubscribedUsers, UserSnackDayMapping
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    unsubscribed = serializers.SerializerMethodField()
    is_ordered = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'is_superuser', 'email',
                  'unsubscribed', 'is_ordered')

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

    @classmethod
    def get_is_ordered(cls, obj):
        today = datetime.now().date()  # UTC time
        qs = UserSnackDayMapping.objects.filter(user=obj, users_snack__date__exact=today)
        if len(qs) > 0:
            ordered = int(qs[0].choice)
        else:
            ordered = -1
        return ordered


