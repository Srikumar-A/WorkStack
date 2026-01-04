from rest_framework import serializers
from ..models import organization,organizationMembership
from auth_master.models import User

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model=organization
        fields='__all__'


class OrganizationMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model=organizationMembership
        fields="__all__"


class OrganizationMembershipRequestSerialzier(serializers.ModelSerializer):
    class Meta:
        model=organizationMembership
        fields=["organization"]
    def create(self,validated_data):
        request=self.context["request"]
        user=request.user

        return organizationMembership.objects.create(
            user=user,
            **validated_data
        )
    

    
class OrganizationUsersSerializer(serializers.ModelSerializer):
    user=serializers.StringRelatedField(read_only=True)

    class Meta:
        model=organizationMembership
        fields=["id","user","organization","role","access","requested_at","approved_at"]


class OrgMemUserRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=organizationMembership
        fields="__all__"
        read_only_fields=["user","organization"]

    def update(self,instance,validated_data):
        previous_status=instance.access
        new_status=validated_data.get("access",previous_status)

        #update it
        instance=super().update(instance,validated_data)

        if previous_status!="granted":
            user=instance.user
            user.organization=instance.organization
            user.save(update_fields=["organization"])


        return instance

