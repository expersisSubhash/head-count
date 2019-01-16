#!/usr/bin/env python
from base_packages_settings import django_module_settings
try:
    django_module_settings()
except IOError:
    pass
from head_count.models import SnackDayMapping
from datetime import datetime, timezone

try:
    obj = SnackDayMapping.objects.create(snack_for_day_id=1,
                                                   date=datetime.now().date())
except Exception as e:
    print(str(e))
