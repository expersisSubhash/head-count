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
            data = JSONParser().parse(request)
            serializer = SnackSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                msg = 'New Snack created.'
            else:
                error = True
                msg = ', '.join(get_custom_error_list(serializer.errors))
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
            msg = 'PDU found.'
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
        msg = "Something went wrong while working on PUD. Error : " + str(e)

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)
