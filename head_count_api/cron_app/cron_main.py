#!/usr/bin/env python
import os
import sys
import django
import traceback

if __name__ == "__main__":
    # include terragraph settings to system search path
    terragraph_setting_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, terragraph_setting_path)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "head_count_api.settings")
    django.setup()

    try:
        if sys.version_info[0] < 3:
            raise Exception(
                "Couldn't load terragraph setup. You are using python 2 environment. Please activate "
                "Python 3 environment."
            )
        try:
            from cron_app.cron_manager import execute_from_command_line
        except ImportError:
            # The above import may fail for some other reason. Ensure that the
            # issue is really that Django is missing to avoid masking other
            # exceptions on Python 2.
            try:
                import django
            except ImportError:
                raise ImportError(
                    "Couldn't import Django. Are you sure it's installed and "
                    "available on your PYTHONPATH environment variable? Did you "
                    "forget to activate a virtual environment?"
                )

        execute_from_command_line(sys.argv)

    except Exception as e:
        print(e)
        print(traceback.format_exc())
