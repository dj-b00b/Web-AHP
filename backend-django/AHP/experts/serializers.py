from experts.models import Expert
from rest_framework import serializers


class ExpertSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        password = validated_data.pop("password")
        expert = Expert.objects.create_user(password=password, **validated_data)

        return expert

    class Meta:
        model = Expert
        fields = ("id", "username", "password", "email", "first_name", "last_name")
