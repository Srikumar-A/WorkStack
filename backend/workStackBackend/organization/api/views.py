from django.shortcuts import render
from rest_framework.views import APIView
from ..models import organization,organizationMembership
from .serializers import (OrganizationSerializer,
                          OrganizationMembershipSerializer,
                          OrganizationMembershipRequestSerialzier,
                          OrganizationUsersSerializer)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# Create your views here.
class OrganizationView(APIView):
    def get(self,request):
        orgs=organization.objects.all()
        serialzier=OrganizationSerializer(orgs,many=True)
        return Response(serialzier.data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serializer=OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class OrganizationDetailView(APIView):
    def get(self,request,pk):
        org=organization.objects.get(pk=pk)
        serializer=OrganizationSerializer(org)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def put(self,request,pk):
        org=organization.objects.get(pk=pk)
        serializer=OrganizationSerializer(org,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        org=organization.objects.get(pk=pk)
        org.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrganizationUserView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request):
        user=request.user
        org=organization.objects.get(id=user.organization.id)
        serializer=OrganizationSerializer(org)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

# creating organization membership views for creating requests and accepting it
'''
only 3 api calls needed:
1. Get-> isAdmin
2. post-> common
3. patch->isAdmin
'''

def isOrgAdmin(user):
    return True
'''
organizationMembership.objects.filter(
        user=user.id,
        role="admin",
        access="granted"
    )'''
class OrganizationMembershipView(APIView):
    permission_classes=[IsAuthenticated,]

    def get(self,request):
        if isOrgAdmin(request.user):
            memberships=organizationMembership.objects.filter(
                organization=request.user.organization,
                access="granted"
            )
            serializer=OrganizationUsersSerializer(memberships,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response({"message":"Access Revoked"},status=status.HTTP_403_FORBIDDEN)
        
    
class OrgMembershipRequestsView(APIView):
    permission_classes=[IsAuthenticated,]

    def get(self,request):
        if isOrgAdmin(request.user):
            memberships=organizationMembership.objects.filter(
                Q(organization=request.user.organization) &
               Q(access="under_review")
            )
            serializer=OrganizationUsersSerializer(memberships,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response({"message":"Access Revoked"},status=status.HTTP_403_FORBIDDEN)
        
    def patch(self,request,id):
        if isOrgAdmin(request.user):
            membership=organizationMembership.objects.get(
                id=id
            )
            serializer=OrganizationMembershipSerializer(membership,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
            return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)
        
    def post(self,request):
        serializer=OrganizationMembershipRequestSerialzier(
            data=request.data,
            context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)