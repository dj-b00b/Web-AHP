from rest_framework.generics import ListCreateAPIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from hierarchies.models import Hierarchy
from hierarchies.serializers import HierarchySerializer


# Create your views here.
@permission_classes([IsAuthenticated])
class GetHierarchiesCreateHierarchies(ListCreateAPIView):
    serializer_class = HierarchySerializer
    queryset = Hierarchy.objects.all()
