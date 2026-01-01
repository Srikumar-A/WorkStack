from rest_framework import serializers
from ..models import organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model=organization
        fields='__all__'