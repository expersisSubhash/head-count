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


from head_count.models import Snack
from head_count.serializers.snackSerializer import SnackSerializer
from head_count.helpers.helpers import get_custom_error_list
from head_count.helpers import constants
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
                            image_url = url + '/head_count/uploads/snacks_image/%d/image_thumbnail_%d.jpg' % (
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
        msg = 'Something went wrong while fetching PDU list. Message : ' + str(e)
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
