import os
import sys
import django


def django_module_settings():
    the_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(the_path)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "head_count_api.settings")
    django.setup()
