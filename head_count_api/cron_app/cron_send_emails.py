from head_count.models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from head_count.views.snackView import get_todays_snack
from head_count.helpers import helpers
import datetime
import pytz


def main():
    # Get the cut out time
    queryset = SystemPreferences.objects.filter(key='Cut out time')
    if len(queryset) > 0:
        cut_out_time = int(queryset[0].value)
        # Get the current time
        dt = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))
        print('cut of time = ' + str(cut_out_time))
        print('current time = ' + str(dt.hour))
        if dt.hour < cut_out_time:
            queryset = SystemPreferences.objects.filter(key='server_address')
            if len(queryset) > 0:
                uri = queryset[0].value
                uri += '/login'

                # Get today's snack
                snack_obj = get_todays_snack()
                if snack_obj:
                    # Get all the users
                    users = User.objects.all()
                    user_id_list = users.filter(is_active=True).values_list('id', flat=True)
                    # Get the users which have ordered for today
                    usrsnack = UserSnackDayMapping.objects.filter(users_snack=snack_obj).values_list('user_id',
                                                                                                     flat=True)
                    # Remove the common items from user id and this list
                    new_user_ids = list(set(user_id_list) - set(usrsnack))

                    subject = "Today's Snack"
                    context = {'snack': snack_obj.snack_for_day.name}
                    # Create a to list to send the emails
                    for usr in new_user_ids:
                        try:
                            usr_obj = users.get(id=usr)
                            token, _ = Token.objects.get_or_create(user_id=usr)
                            url = uri + '?uid=' + token.key
                            context['url'] = url
                            success = helpers.order_verification_email(subject, context, [usr_obj.email])
                            if success:
                                print('Mail to ' + usr_obj.email + ' sent successfully')
                        except Exception as e:
                            print(str(e))
            else:
                print('No server address')
        else:
            print('Expired')


if __name__ == '__main__':
    main()
