from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class Snack(models.Model):
    name = models.CharField(max_length=255, null=True, verbose_name="name")
    default_price = models.FloatField(default=0.0)
    image_name = models.CharField(max_length=100, null=True)
    image_url = models.CharField(max_length=255, null=True)
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


class SystemPreferences(models.Model):
    key = models.CharField(max_length=120, primary_key=True)
    value = models.TextField(blank=True)

    def __unicode__(self):
        return self.key


class DefaultChoice(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    default_choice = models.BooleanField(default=False)


class UnSubscribedUsers(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)








