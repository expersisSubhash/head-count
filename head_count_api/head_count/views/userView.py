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
from head_count.helpers import constants


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes((AllowAny, ))
def login(request):
    context_data = dict()
    username = request.data.get("email")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_401_UNAUTHORIZED)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    context_data['token'] = token.key
    context_data['user'] = {'id': user.id, 'email': user.email,
                            'first_name': user.first_name, 'last_name': user.last_name}
    return Response(context_data, status=HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def user_list(request):
    context_data = dict()
    msg = ''
    error = False
    try:
        if request.method == 'GET':
            queryset = User.objects.order_by('-id')
            serializer = UserSerializer(queryset, many=True)
            context_data['user_list'] = serializer.data
        elif request.method == 'POST':
            data = JSONParser().parse(request)
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                msg = 'New User created.'
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
