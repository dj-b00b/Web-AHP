from django.urls import path
from hierarchies.views import GetHierarchiesCreateHierarchies

urlpatterns = [
    path('', GetHierarchiesCreateHierarchies.as_view(), name="get_hierarchies_or_create_hierarchy"),
]
