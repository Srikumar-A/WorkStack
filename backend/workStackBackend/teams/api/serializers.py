from rest_framework import serializers
from ..models import teams,team_members
from auth_master.models import User

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model=teams
        fields="__all__"

class CreateTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model=teams
        exclude=["organization"]


class TeamMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model=team_members
        fields=["id","team","user","role"]
        extra_kwargs={
            "team":{"read_only":True}
        }

    def create(self,validated_data):
        return team_members.objects.create(**validated_data)

class TeamDetailSerializer(serializers.ModelSerializer):
    members=TeamMembersSerializer(many=True)
    class Meta:
        model=teams
        fields=["id","team_name","organization","members"]

# serializer for role update
class TeamMemberRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=team_members
        fields=["role"]

# sending members based on team  --> this is for teams page
class TeamUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","username","email"]
class TeamMemberUserSerializer(serializers.ModelSerializer):
    user=TeamUserSerializer(read_only=True)
    class Meta:
        model=team_members
        fields=["id","user","role"]