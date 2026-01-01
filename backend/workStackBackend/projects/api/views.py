from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ProjectSerializer
from ..models import Project
from rest_framework.response import Response
from rest_framework import status
from teams.models import teams,team_members
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# Create your views here.
class ProjectListView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        projects=Project.objects.filter(
            Q(team__members__user=user) |
            Q(created_by=request.user)).distinct()
        serializer=ProjectSerializer(projects,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer=ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                created_by=request.user
            )
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# add permissions to ensure the user is authorized for the same    
class ProjectDetailView(APIView):
    def get(self,request,pk):
        try:
            project=Project.objects.get(pk=pk)
            serializer=ProjectSerializer(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    def patch(self,request,pk):
        try:
            project=Project.objects.get(pk=pk)
            serializer=ProjectSerializer(project,data=request.data,partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def delete(self,request,pk):
        try:
            project=Project.objects.get(pk=pk)
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

