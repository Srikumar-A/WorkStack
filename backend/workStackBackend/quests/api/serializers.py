from rest_framework import serializers
from ..models import Quest


class QuestSerializer(serializers.ModelSerializer):
    project=serializers.StringRelatedField(read_only=True)
    team=serializers.StringRelatedField(read_only=True)
    organization=serializers.StringRelatedField(read_only=True)
    assigned_to=serializers.StringRelatedField(read_only=True)
    created_by=serializers.StringRelatedField(read_only=True)
    class Meta:
        model=Quest
        fields='__all__'