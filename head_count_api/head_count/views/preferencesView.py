from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from django.db import transaction
from head_count.models import SystemPreferences
from head_count.serializers.preferencesSerializer import PreferencesSerializer
from head_count.helpers import constants


@api_view(['GET', 'POST'])
@permission_classes((AllowAny,))
def preferences_list(request):
    context_data = dict()
    msg = ''
    error = False
    try:
        if request.method == 'GET':
            queryset = SystemPreferences.objects.all()
            serializer = PreferencesSerializer(queryset, many=True)
            context_data['preferences'] = serializer.data
        elif request.method == 'POST':
            key = request.data.get('key', '')
            value = request.data.get('value', 0)

            if not key:
                error = True
                msg = "Name is required"

            # Type is required
            if not error and not value:
                error = True
                msg = "Value is required"

            try:
                # if no error insert data
                if not error:
                    with transaction.atomic():
                        obj, created = SystemPreferences.objects.get_or_create(key=key)
                        if obj:
                            obj.value = value
                            obj.save()

                        msg = "Settings updated"
            except Exception as e:
                error = True
                msg = str(e)

        else:
            error = True
            msg = 'Invalid http method'
    except Exception as e:
        msg = 'Something went wrong while fetching Settings. Message : ' + str(e)
        error = True

    context_data[constants.RESPONSE_ERROR] = error
    context_data[constants.RESPONSE_MESSAGE] = msg
    return JsonResponse(context_data, status=200)