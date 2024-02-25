from django.urls import path
from experts.views import CreateExpert, CustomAuthToken

urlpatterns = [
    path("token-auth/", CustomAuthToken.as_view(), name="create_or_get_auth_token"),
    path("", CreateExpert.as_view(), name="create_expert"),
]
