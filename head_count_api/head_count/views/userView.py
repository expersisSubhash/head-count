from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.http import JsonResponse

from head_count.models import User
from head_count.serializers.userSerializer import UserSerializer
from head_count.helpers.helpers import get_custom_error_list
from head_count.helpers import constants, helpers
from head_count.models import SystemPreferences, UnSubscribedUsers, UserSnackDayMapping
from head_count.views.snackView import get_todays_snack



@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes((AllowAny,))
def login(request):
    context_data = dict()
    username = request.data.get("email")
    password = request.data.get("password")
    token_key = request.data.get('uid')
    if token_key:
        return login_with_token(request)
    else:
        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'}, status=HTTP_401_UNAUTHORIZED)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

        token, _ = Token.objects.get_or_create(user=user)
        context_data['token'] = token.key
        context_data['user'] = {'id': user.id, 'email': user.email,
                                'first_name': user.first_name, 'last_name': user.last_name,
                                'is_super': user.is_superuser}

        # Save url in system preferences
        SystemPreferences.objects.get_or_create(key='server_address', value=request.get_host(), defaults={
            'key': 'server_address',
            'value': request.get_host()
        })
    return Response(context_data, status=HTTP_200_OK)


def login_with_token(request):
    token_key = request.data.get('uid')
    try:
        context_data = dict()
        token = Token.objects.get(key=token_key)
        user = token.user
        context_data['token'] = token.key
        context_data['user'] = {'id': user.id, 'email': user.email,
                                'first_name': user.first_name, 'last_name': user.last_name,
                                'is_super': user.is_superuser}
        # Save url in system preferences
        SystemPreferences.objects.get_or_create(key='server_address', value=request.get_host(), defaults={
            'key': 'server_address',
            'value': request.get_host()
        })
        response = Response(context_data, status=HTTP_200_OK)
    except Exception as e:
        response = Response({'error': 'Invalid Credentials'}, status=HTTP_401_UNAUTHORIZED)
    return response


@api_view(['GET', 'POST'])
@permission_classes((AllowAny,))
def user_list(request):
    context_data = dict()
    msg = ''
    error = False
    try:
        if request.method == 'GET':
            queryset = User.objects.order_by('first_name')
            serializer = UserSerializer(queryset, many=True)
            context_data['user_list'] = serializer.data
        elif request.method == 'POST':
            data = JSONParser().parse(request)
            # Get email from data
            email = data['email']
            data['username'] = email
            # Auto generate the password
            password = helpers.generate_random_password()
            # Default password
            data['password'] = password
            serializer = UserSerializer(data=data, context={'pwd': password})
            if serializer.is_valid():
                serializer.save()
                msg = 'New User created.'
                # Send an email to user
                subject = 'Welcome'
                # Send the mail with this password
                to_list = [email]
                content = ", Following are your login details \n username: " + email + "\n" + "password:" \
                          + password + "\nPlease make sure to change your password to something that you can remember."

                url = request.get_host()
                url = url + '/login'
                content = content + "\n" + url
                sent = helpers.send_email(subject, content, to_list)
                if sent:
                    print('Email with password sent successfully')
            else:
                error = True
                msg = ', '.join(get_custom_error_list(serializer.errors))
        else:
            error = True
            msg = 'Invalid http method'
    except Exception as e:
        msg = 'Something went wrong while fetching User list. Message : ' + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@permission_classes((AllowAny,))
def user_detail(request, pk):
    context_data = dict()
    try:
        try:
            user = User.objects.get(pk=pk)
            error = False
            msg = 'User found.'
        except User.DoesNotExist:
            user = None
            error = True
            msg = 'User does not exist.'

        if not error:
            if request.method == 'GET':
                serializer = UserSerializer(user)
                context_data['user'] = serializer.data

            elif request.method == 'PUT':
                data = JSONParser().parse(request)
                # Get email from data
                email = data['email']
                data['username'] = email

                serializer = UserSerializer(user, data=data)
                if serializer.is_valid():
                    serializer.save()
                    msg = 'User is updated.'
                else:
                    error = True
                    msg = ', '.join(get_custom_error_list(serializer.errors))

            elif request.method == 'DELETE':
                user.delete()
                msg = 'User is deleted.'

            else:
                error = True
                msg = 'Invalid http method.'

    except Exception as e:
        error = True
        msg = "Something went wrong while working on User. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@permission_classes((AllowAny,))
def change_password(request):
    context_data = dict()
    try:
        data = JSONParser().parse(request)
        # Get the email id
        email = data['email']
        try:
            user = User.objects.get(email=email)
            error = False
            msg = 'User found.'
        except User.DoesNotExist:
            user = None
            error = True
            msg = 'User does not exist.'

        if not error:
            # Check the password
            is_valid = user.check_password(data['existing_password'])
            if is_valid:
                user.set_password(data['new_password'])
                msg = 'Password changed successfully'
                user.save()
            else:
                error = True
                msg = 'The old password is wrong, Please provide the correct old password'

    except Exception as e:
        error = True
        msg = "Something went wrong while changing the password. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes([])
@permission_classes((AllowAny,))
def forgot_password(request):
    context_data = dict()
    try:
        data = JSONParser().parse(request)
        # Get the email id
        email = data['email']
        try:
            user = User.objects.get(email=email)
            error = False
            msg = 'User found.'
        except User.DoesNotExist:
            user = None
            error = True
            msg = email + ' does not exist in our records, Please contact Administrator'

        if not error:
            # Generate a random password
            password = helpers.generate_random_password()
            subject = 'Reset password'
            # Send the mail with this password
            to_list = [email]
            content = subject + " Please use following password to login, Please make sure to reset password after " \
                                "you login \n" + password
            sent = helpers.send_email(subject, content, to_list)
            if sent:
                user.set_password(password)
                user.save()
                msg = """An email with your new password has been sent to the email address you provided, 
                You should be able to login using the password provided"""

    except Exception as e:
        error = True
        msg = "Something went wrong while processing that request. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@permission_classes((AllowAny,))
def toggle_email_subscription(request):
    context_data = dict()
    try:
        data = JSONParser().parse(request)
        # Get the email id
        user_id = data
        try:
            user = User.objects.get(id=user_id)
            error = False
            msg = 'User found.'
        except User.DoesNotExist:
            user = None
            error = True
            msg = 'User does not exist.'

        if not error:
            try:
                obj = UnSubscribedUsers.objects.get(user_id=user_id)
                obj.delete()
                context_data['success'] = True
            except UnSubscribedUsers.DoesNotExist as e:
                UnSubscribedUsers.objects.create(user_id=user_id)
                context_data['success'] = True
            except Exception as e:
                error = True
                msg = "Something went wrong while unsubribing user. Error : " + str(e)

    except Exception as e:
        error = True
        msg = "Something went wrong while unsubribing user. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes([])
@permission_classes((AllowAny,))
def change_order_status_for_user(request):
    context_data = dict()
    try:
        data = JSONParser().parse(request)
        # Get the user id
        user_id = data['user_id']
        try:
            user = User.objects.get(id=user_id)
            error = False
            msg = 'user found'
        except User.DoesNotExist:
            user = None
            error = True
            msg = user_id + ' does not exist in our records, Please contact Administrator'

        if not error:
            # Check if there is snack for today
            snack_for_day = get_todays_snack()
            new_status = -1
            if snack_for_day:
                # Get the status
                current_status = data['status']
                if current_status == -1:
                    new_status = 1
                elif current_status == 1:
                    new_status = 0
                elif current_status == 0:
                    new_status = 1

                obj, created = UserSnackDayMapping.objects.get_or_create(users_snack=snack_for_day, user_id=user_id,
                                                                         defaults={'users_snack': snack_for_day,
                                                                                   'user_id': user_id})
                if obj:
                    obj.choice = True if new_status == 1 else False
                    obj.save()
                    msg = 'Changes saved successfully'
            else:
                msg = 'Can not save the changes, Snack is not specified for today'
    except Exception as e:
        error = True
        msg = "Something went wrong while processing that request. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)

