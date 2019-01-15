#!/usr/bin/env python
from base_packages_settings import django_module_settings
try:
    django_module_settings()
except IOError:
    pass
from django.contrib.auth.models import User

try:
    user, created = User.objects.get_or_create(username='manoj', defaults={'username': 'manoj.patwardhan@xebrium.com',
                                                                           'email': 'manoj.patwardhan@xebrium.com'})
    if created:
        user.set_password('xebrium')
        user.is_superuser = True
        user.first_name = "Manoj"
        user.last_name = "Patwardhan"
        user.save()

    user, created = User.objects.get_or_create(username='subhash', defaults={'username': 'subhash.amale@xebrium.com',
                                                                             'email': 'subhash.amale@xebrium.com'})
    if created:
        user.set_password('xebrium')
        user.is_superuser = False
        user.first_name = "Subhash"
        user.last_name = "Amale"
        user.save()

    user, created = User.objects.get_or_create(username='rashmi', defaults={'username': 'rashmi.bodhani@xebrium.com',
                                                                            'email': 'rashmi.bodhani@xebrium.com'})
    if created:
        user.set_password('xebrium')
        user.is_superuser = False
        user.first_name = "Rashmi"
        user.last_name = "Bodhani"
        user.save()

    user, created = User.objects.get_or_create(username='rutuja', defaults={'username': 'pankaj.badgujar@xebrium.com',
                                                                            'email': 'pankaj.badgujar@xebrium.com'})
    if created:
        user.set_password('xebrium')
        user.is_superuser = False
        user.first_name = "Pankaj"
        user.last_name = "Badgujar"
        user.save()
except Exception as e:
    print(str(e))
