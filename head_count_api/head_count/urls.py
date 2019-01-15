from django.conf.urls import url
from head_count.views import userView, snackView

urlpatterns = [
    url('api-token-auth/', userView.login),
    url('change_password/$', userView.change_password),
    url('forgot_password/$', userView.forgot_password),

    url(r'^users/$', userView.user_list),
    url(r'^getUser/(?P<pk>[0-9]+)/$', userView.user_detail),
    url(r'^editUser/(?P<pk>[0-9]+)/$', userView.user_detail),

    url(r'^removeUser/(?P<pk>[0-9]+)/$', userView.user_detail),

    url(r'^snacks/$', snackView.snack_list),
    url(r'^getSnack/(?P<pk>[0-9]+)/$', snackView.snack_detail),
    url(r'^editSnacks/$', snackView.snack_list),
    url(r'^removeSnacks/(?P<pk>[0-9]+)/$', snackView.snack_detail),
    url(r'^getSnackForToday/(?P<pk>[0-9]+)/$', snackView.get_snack_for_today),
    url(r'^saveUserSnackChoice/$', snackView.save_user_snack_and_choice),

]

