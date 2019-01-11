from django.conf.urls import url
from head_count.views import userView

urlpatterns = [
    url('api-token-auth/', userView.login),
    url(r'^devices/$', userView.user_list),

]
