from django.shortcuts import render
from rest_framework.views import APIView
from ..models import organization
from .serializers import OrganizationSerializer
from rest_framework.response import Response
from rest_framework import status

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
