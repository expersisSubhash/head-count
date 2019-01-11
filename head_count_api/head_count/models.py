from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class Snack(models.Model):
    name = models.CharField(max_length=255, null=True, verbose_name="name")
    default_price = models.FloatField(default=0.0)
    image_name = models.CharField(max_length=100, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Snack"
        verbose_name_plural = "Snacks"


class SnackDayMapping(models.Model):
    date = models.DateField(default=timezone.now)
    snack_for_day = models.ForeignKey(Snack)
    price_for_day = models.FloatField(default=0.0)


class UserSnackDayMapping(models.Model):
    user = models.ForeignKey(User)
    users_snack = models.ForeignKey(SnackDayMapping)
    choice = models.BooleanField(default=False)





