#!/usr/bin/env python
from base_packages_settings import django_module_settings

try:
    django_module_settings()
except IOError:
    pass
from head_count.models import SystemPreferences

try:
    obj, created = SystemPreferences.objects.get_or_create(key='Cut out time', defaults={'value':15})
    if obj:
        obj.value = 15
        obj.save()

except Exception as e:
    print(str(e))
