# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2019-01-18 05:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('head_count', '0005_auto_20190115_0841'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemPreferences',
            fields=[
                ('key', models.CharField(max_length=120, primary_key=True, serialize=False)),
                ('value', models.TextField(blank=True)),
            ],
        ),
    ]
