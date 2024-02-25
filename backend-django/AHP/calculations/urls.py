from django.urls import path
from calculations.views import (
    ShowCalculationsCreateUpdateDeleteCalculation,
    CalcMediumGlobalPriority,
)


urlpatterns = [
    path(
        "",
        ShowCalculationsCreateUpdateDeleteCalculation.as_view(),
        name="show_calculations_or_create_calculation",
    ),
    path(
        "<int:pk>/",
        ShowCalculationsCreateUpdateDeleteCalculation.as_view(),
        name="update_or_delete_calculation",
    ),
    path(
        "medium_gp_hierarchies/<int:pk>/",
        CalcMediumGlobalPriority.as_view(),
        name="show_medium_gp_hierarchies",
    ),
]
