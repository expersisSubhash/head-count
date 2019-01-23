from django.template.loader import get_template
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
import smtplib
import string
import random


def get_custom_error_list(errors, custom_error_list=None):
    if not custom_error_list:
        custom_error_list = []
    if isinstance(errors, dict):
        for key, val in errors.items():
            if isinstance(val, dict):
                custom_error_list = get_custom_error_list(val, custom_error_list)
            elif isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        custom_error_list = get_custom_error_list(item, custom_error_list)
                    else:
                        if key != 'non_field_errors':
                            title = str(key).capitalize()
                            msg = title + ': ' + item
                        else:
                            msg = item
                        custom_error_list.append(msg)
            else:
                if key != 'non_field_errors':
                    title = str(key).capitalize()
                    msg = title + ': ' + val
                else:
                    msg = val
                custom_error_list.append(msg)
    return custom_error_list


def send_email(subject, body, to_list):
    success = 0
    try:
        subject = subject
        from_email = settings.EMAIL_HOST_USER
        message = body
        msg = EmailMessage(subject, message, to=to_list, from_email=from_email)
        msg.content_subtype = 'plain'
        success = msg.send()
    except Exception as e:
        print(str(e))

    return True if success > 0 else False


def generate_random_password():
    chars_fixed = string.ascii_letters + string.digits
    min_size_pass = 3
    max_size_pass = 8

    password = "".join(random.choice(chars_fixed) for x in range(random.randint(min_size_pass, max_size_pass)))
    return password


def order_verification_email(subject, context, recipient_list=list):
    success = 0
    try:
        from_email = settings.EMAIL_HOST_USER
        message = get_template('email/order_verification.html').render(context)
        msg = EmailMessage(subject, message, to=recipient_list, from_email=from_email)
        msg.content_subtype = 'html'
        success = msg.send()
    except Exception as e:
        print(str(e))
    return True if success > 0 else False
