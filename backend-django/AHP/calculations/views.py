from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from calculations.serializers import (
    CalculationSerializer,
    CalculationSerializerDetailed,
)
from calculations.models import Calculation
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_list_or_404
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from calculations.utils import calc_medium_global_priority_expert_calcs


# Create your views here.
@permission_classes([IsAuthenticated])
class ShowCalculationsCreateUpdateDeleteCalculation(
    ListCreateAPIView, UpdateAPIView, DestroyAPIView
):
    serializer_class = CalculationSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return CalculationSerializerDetailed

        return CalculationSerializer

    def get_queryset(self):
        return (
            Calculation.objects.filter(user=self.request.user)
            .select_related("hierarchy")
            .select_related("user")
        )

    def get_object(self):
        calculation = Calculation.objects.filter(id=self.kwargs.get("pk")).last()
        if calculation.user != self.request.user:
            raise ValidationError({"error": "Удалять можно только свои расчеты!"})

        return calculation

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@permission_classes([IsAuthenticated])
class CalcMediumGlobalPriority(ListAPIView):
    serializer_class = CalculationSerializer

    def get_queryset(self):
        return get_list_or_404(Calculation, hierarchy_id=self.kwargs["pk"])

    def list(self, request, *args, **kwargs):
        count_experts, ranked_medium_summ_gp = calc_medium_global_priority_expert_calcs(
            calcs_experts=self.get_queryset()
        )

        return Response(
            data={
                "count_experts": count_experts,
                "average_experts_gp_calcs": ranked_medium_summ_gp,
            }
        )
