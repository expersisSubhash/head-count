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


def send_email(to_list, body):
    server = None
    success = False
    try:
        fromaddr = 'snack.day.python@gmail.com'
        toaddrs = to_list
        msg = body
        username = 'snack.day.python@gmail.com'
        password = 'snackday@2018'
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login(username, password)
        server.sendmail(fromaddr, toaddrs, msg)
        server.quit()
        success = True
    except Exception as e:
        print(str(e))
        if server:
            server.quit()

    return success


def generate_random_password():
    chars_fixed = string.ascii_letters + string.digits
    min_size_pass = 3
    max_size_pass = 8

    password = "".join(random.choice(chars_fixed) for x in range(random.randint(min_size_pass, max_size_pass)))
    return password


