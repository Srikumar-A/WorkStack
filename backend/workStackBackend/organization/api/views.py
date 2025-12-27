from django.shortcuts import render
from rest_framework.views import APIView
from ..models import organization
from .serializers import OrganizationSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class OrganizationView(APIView):
    def get(self,request):
        return organization.objects.all()
    
    def post(self,request):
        serializer=OrganizationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
