from calculations.models import Calculation
from hierarchies.serializers import HierarchySerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class CalculationSerializerDetailed(serializers.ModelSerializer):
    hierarchy = HierarchySerializer()
    count_experts_calcs = serializers.SerializerMethodField()

    class Meta:
        model = Calculation
        fields = "__all__"

    def get_count_experts_calcs(self, instance):
        return Calculation.objects.filter(hierarchy=instance.hierarchy.id).count()


class CalculationSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        self.check_existence_calcs_by_hierarchy(validated_data)

        return super().create(validated_data)

    def check_existence_calcs_by_hierarchy(self, validated_data):
        calculation = Calculation.objects.filter(
            hierarchy_id=validated_data["hierarchy"].id,
            user_id=self.context.get("request").user.id,
        ).last()
        if calculation:
            raise ValidationError(
                {
                    "error": "Расчеты текущего эксперта по данной иерархии уже существуют, их можно только обновить!",
                    "calculation_id": calculation.id,
                }
            )

    class Meta:
        model = Calculation
        fields = "__all__"
        read_only_fields = ["user"]
