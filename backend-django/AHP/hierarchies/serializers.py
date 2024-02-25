from hierarchies.models import Hierarchy
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class HierarchySerializer(serializers.ModelSerializer):
    def validate_characteristics(self, value):
        prev_fields = self._kwargs["data"]
        if not (
            len(value) == len(prev_fields["criteria"])
            and self.validate_nested_lst(
                two_d_lst=value, count_alternatives=len(prev_fields["alternatives"])
            )
        ):
            raise ValidationError(
                {
                    "error": "Поле characterictics должно являться двумерным массивом длиной массива criteria, где каждый массив имеет длину массива alternatives!"
                }
            )
        return value

    def validate_nested_lst(self, two_d_lst, count_alternatives):
        for i in range(len(two_d_lst)):
            if len(two_d_lst[i]) != count_alternatives:
                return False

        return True

    def create(self, validated_data):
        self.check_existence_hierarchy(validated_data)

        return super().create(validated_data)

    def check_existence_hierarchy(self, validated_data):
        if Hierarchy.objects.filter(
            name=validated_data["name"],
            criteria=validated_data["criteria"],
            alternatives=validated_data["alternatives"],
            characteristics=validated_data["characteristics"],
        ).exists():
            raise ValidationError({"error": "Данная иерархия уже существует!"})

    class Meta:
        model = Hierarchy
        fields = ("id", "name", "criteria", "alternatives", "characteristics")
