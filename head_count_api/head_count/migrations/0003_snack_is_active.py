# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2019-01-11 16:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('head_count', '0002_auto_20190110_1111'),
    ]

    operations = [
        migrations.AddField(
            model_name='snack',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]