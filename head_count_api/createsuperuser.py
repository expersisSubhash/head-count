#!/usr/bin/env python
from base_packages_settings import django_module_settings
try:
    django_module_settings()
except IOError:
    pass
from django.contrib.auth.models import User

try:

    try:
        user = User.objects.get(username='manoj.patwardhan@xebrium.com')
    except User.DoesNotExist as e:
        user = User.objects.create_user('manoj.patwardhan@xebrium.com', 'manoj.patwardhan@xebrium.com', 'xebrium@2018')
        user.is_superuser = True
        user.first_name = "Administrator"
        user.is_staff = True
        user.save()
except Exception as e:
    print(str(e))
finally:
    pass
