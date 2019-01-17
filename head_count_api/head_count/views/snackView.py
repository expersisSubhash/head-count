from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
import datetime
from datetime import datetime, timezone
from head_count.models import Snack, SnackDayMapping, UserSnackDayMapping
from head_count.serializers.snackSerializer import (SnackSerializer, SnackDayMappingSerializer,
                                                    UserSnackMappingSerializer)
from head_count.helpers.helpers import get_custom_error_list
from head_count.helpers import constants, helpers
from PIL import Image
from django.db import transaction
import os


@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def snack_list(request):
    context_data = dict()
    msg = ''
    error = False
    try:
        if request.method == 'GET':
            queryset = Snack.objects.order_by('-id')
            serializer = SnackSerializer(queryset, many=True)
            context_data['snack_list'] = serializer.data
        elif request.method == 'POST':
            snack_id = int(request.POST.get('id', 0))
            name = request.POST.get('name', '')
            default_price = float(request.POST.get('default_price', 0))
            image = request.FILES.get('image_file', None)

            if not name:
                error = True
                msg = "Name is required"

            # Type is required
            if not error and not default_price:
                error = True
                msg = "Price is required"

            try:
                # if no error insert data
                if not error:
                    with transaction.atomic():
                        # If config id present update the record
                        # else add the record
                        if snack_id == 0:
                            # Create test suite entry
                            snack_obj = Snack.objects.create(
                                name=name,
                                default_price=default_price,
                            )
                        else:
                            snack_obj = Snack.objects.select_for_update().get(pk=snack_id)
                            snack_obj.name = name
                            snack_obj.default_price = default_price
                            snack_obj.save()
                        if image:
                            size = (128, 128)
                            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                            my_path = os.path.join(base_dir, 'uploads',
                                                   'snacks_image', str(snack_obj.id))
                            if not os.path.exists(my_path):
                                os.makedirs(my_path)
                            image_name = "image_original_%s.jpg" % str(snack_obj.id)
                            image_path = os.path.join(my_path, image_name)
                            with open(image_path, 'wb+') as destination:
                                for chunk in image.chunks():
                                    destination.write(chunk)
                            output_thumb_name = "image_thumbnail_%s.jpg" % str(snack_obj.id)
                            output_thumbnail = os.path.join(my_path, output_thumb_name)
                            try:
                                im = Image.open(image_path)
                                im.thumbnail(size)
                                im.convert('RGB').save(output_thumbnail, "JPEG")
                            except IOError:
                                print(("cannot create thumbnail for", my_path))

                            protocol = "http://"
                            server_add = request.META['REMOTE_ADDR']
                            server_port = request.META['SERVER_PORT']
                            if 'https' in request.META['SERVER_PROTOCOL']:
                                protocol = "https://"

                            url = protocol + server_add + ':' + server_port
                            image_url = url + '/head_count/uploads/snacks_image/%d/image_original_%d.jpg' % (
                                snack_obj.id, snack_obj.id)
                            snack_obj.image_url = image_url

                            snack_obj.image_name = image_name
                            snack_obj.save()
                        error = False
                        msg = "Snack updated"
            except Exception as e:
                error = True
                msg = str(e)

        else:
            error = True
            msg = 'Invalid http method'
    except Exception as e:
        msg = 'Something went wrong while fetching Snack list. Message : ' + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@permission_classes((AllowAny, ))
def snack_detail(request, pk):
    context_data = dict()
    try:
        try:
            snack = Snack.objects.get(pk=pk)
            error = False
            msg = 'Snack found.'
        except Snack.DoesNotExist:
            snack = None
            error = True
            msg = 'Snack does not exist.'

        if not error:
            if request.method == 'GET':
                serializer = SnackSerializer(snack)
                context_data['snack'] = serializer.data

            elif request.method == 'PUT':
                data = JSONParser().parse(request)
                serializer = SnackSerializer(snack, data=data)
                if serializer.is_valid():
                    serializer.save()
                    msg = 'Snack is updated.'
                else:
                    error = True
                    msg = ', '.join(get_custom_error_list(serializer.errors))

            elif request.method == 'DELETE':
                snack.delete()
                msg = 'Snack is deleted.'

            else:
                error = True
                msg = 'Invalid http method.'

    except Exception as e:
        error = True
        msg = "Something went wrong while getting snacks. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def get_snack_for_today(request, pk):
    context_data = dict()
    msg = ''
    error = False
    try:
        print(request.data)
        # Get today's date
        snack_day_obj = get_todays_snack()
        if snack_day_obj:
            # Serialize here
            serializer = SnackDayMappingSerializer(snack_day_obj)
            context_data['snack'] = serializer.data
            # Get snack from snack_day obj
            snack = snack_day_obj.snack_for_day
            snack_serializer = SnackSerializer(snack)
            context_data['snack_info'] = snack_serializer.data
            # Check if we have this snack and users entry in the UserSnackDayMapping
            user_snack_mapping_list = UserSnackDayMapping.objects.filter(user_id=pk,
                                                                         users_snack=snack_day_obj)
            if len(user_snack_mapping_list) > 0:
                user_snack_mapping_obj = user_snack_mapping_list[0]
                context_data['choice'] = user_snack_mapping_obj.choice
    except Exception as e:
        msg = "Something went wrong while getting today's Snack. Message : " + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def save_user_snack_and_choice(request):
    context_data = dict()
    error = False
    try:
        data = JSONParser().parse(request)
        # Get the user id, SnackDay mapping object and users choice Yes/No
        user_id = data['user_id']
        snack_day_mapping_id = data['snack_day_id']
        choice = data['choice']

        user, created = UserSnackDayMapping.objects.get_or_create(user_id=user_id, defaults={'user_id': user_id,
                                                                                             'users_snack_id':
                                                                                                 snack_day_mapping_id})
        if user:
            user.choice = choice
            user.save()
            msg = 'Changes saved successfully'
        else:
            msg = "Something went wrong while saving your choice, Please try again"
            error = True
    except Exception as e:
        msg = "Something went wrong while saving your choice : " + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def get_snacks_for_dates(request):
    context_data = dict()
    error = False
    msg = ''
    try:
        data = request.data
        # Walk through this dates and get Snack if any
        date_snack_list = list()
        for date in data:
            date_snack_dict = dict()
            date_obj = datetime.fromtimestamp(date/1000.0).date()

            snack_for_day_qs = SnackDayMapping.objects.filter(date=date_obj)
            if snack_for_day_qs and len(snack_for_day_qs) > 0:
                snack_for_day = snack_for_day_qs[0]
                # Get the Snack object
                serializer = SnackDayMappingSerializer(snack_for_day)

                date_snack_dict['date'] = date
                date_snack_dict['snack'] = serializer.data
            else:
                date_snack_dict['date'] = date
                date_snack_dict['snack'] = {}
            date_snack_list.append(date_snack_dict)

        context_data['data'] = date_snack_list

    except Exception as e:
        msg = "Something went wrong while saving your choice : " + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def save_snacks_for_dates(request):
    context_data = dict()
    error = False
    msg = ''
    try:
        data = request.data
        is_todays_snack_updated = False
        today = datetime.now(timezone.utc).date()  # UTC time
        # Walk through this dates and get Snack if any
        for tmp in data:
            try:
                if 'date' in tmp:
                    date = datetime.fromtimestamp(tmp['date']/1000.0).date()
                    if date == today:
                        is_todays_snack_updated = True

                # Update
                if 'snack_day_mapping_id' in tmp and tmp['snack_day_mapping_id']:
                    obj = SnackDayMapping.objects.get(id=tmp['snack_day_mapping_id'])

                    if 'snack' in tmp and tmp['snack']:
                        # Get the object with snack_day_mapping_id
                        obj.snack_for_day_id = tmp['snack']
                        obj.date = datetime.fromtimestamp(tmp['date']/1000.0).date()
                        obj.price_for_day = tmp['price']
                        obj.save()
                    else:
                        notify_cancellation(today, obj)
                        obj.delete()
                else:
                    if 'snack' in tmp and tmp['snack']:
                        SnackDayMapping.objects.create(snack_for_day_id=tmp['snack'],
                                                       date=datetime.fromtimestamp(tmp['date']/1000.0).date(),
                                                       price_for_day=tmp['price'])

            except SnackDayMapping.DoesNotExist as e:
                msg = 'Exception occured while updating the Snacks, Please contact System Admin' + str(e)
                error = True
            except Exception as e:
                msg = 'Exception occured while updating the Snacks, Please contact System Admin' + str(e)
                error = True

        if not error:
            msg = 'Changes saved successfully'

        if is_todays_snack_updated:
            notify_change()

    except Exception as e:
        msg = "Something went wrong while saving your choice : " + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


@api_view(['GET'])
@permission_classes((AllowAny, ))
def get_interested_users_count(request):
    context_data = dict()
    error = False
    msg = ''
    cnt = 0
    try:
        print(request.data)
        # Get all the UserSnackDayMapping obj for today
        snack = get_todays_snack()
        if snack:
            queryset = UserSnackDayMapping.objects.filter(users_snack=snack)
            serializer = UserSnackMappingSerializer(queryset, many=True)
            context_data['user_list'] = serializer.data
            context_data['user_count'] = queryset.filter(choice=True).count()

    except Exception as e:
        msg = "Something went wrong while saving your choice : " + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)


# Get all the user who had marked either yes/no for today's snack
def notify_change():
    # Get today's snack
    snack_day = get_todays_snack()
    if snack_day:
        to_list = get_user_emails_for_snack_day(snack_day)
        # Send the mail with this password
        content = "There is a change in Snack that was scheduled for Today, Please visit the site and update " \
                  "your choice, The new snack is" + snack_day.snack_for_day.name
        sent = helpers.send_email(to_list, content)
        if sent:
            print('Email sent successfully')


def notify_cancellation(today, obj):
    if obj.date == today:
        if obj:
            to_list = get_user_emails_for_snack_day(obj)
            # Send the mail with this password
            content = "Today's snack has been canceled, Please contact HR for more information"
            sent = helpers.send_email(to_list, content)
            if sent:
                print('Email sent successfully')
    else:
        pass


def get_todays_snack():
    snack_day_obj = None
    # Get today's date
    dt = datetime.now(timezone.utc).date()  # UTC time
    snack_day_mapping_list = SnackDayMapping.objects.filter(date=dt)
    if len(snack_day_mapping_list) > 0:
        snack_day_obj = snack_day_mapping_list[0]
    return snack_day_obj


def get_user_emails_for_snack_day(snack_day):
    return UserSnackDayMapping.objects.filter(users_snack=snack_day).values_list('user__email', flat=True)
