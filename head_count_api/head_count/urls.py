from django.conf.urls import url
from head_count.views import userView

urlpatterns = [
    url('api-token-auth/', userView.login),
    url(r'^users/$', userView.user_list),
    url(r'^editUser/(?P<pk>[0-9]+)/$', userView.user_detail),



]
