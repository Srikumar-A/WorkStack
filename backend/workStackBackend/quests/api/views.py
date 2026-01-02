from django.shortcuts import render
from rest_framework.views import APIView
from ..models import Quest
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuestSerializer
from django.db.models import Q
from projects.models import Project
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class QuestView(APIView):
    def get(self,request,proj_id):
        project_=Project.objects.get(id=proj_id)
        quests=Quest.objects.filter(
            Q(project=project_) &
            Q(
                Q(created_by=request.user) |
                Q(assigned_to=request.user) |
                Q(team__members__user=request.user)
            )

        ).distinct()
        serializer=QuestSerializer(quests,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request,proj_id):
        project_=Project.objects.get(id=proj_id)
        serializer=QuestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project_,
                            created_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class QuestDetailView(APIView):
    def get(self,request,pk):
        quests=Quest.objects.get(pk=pk)
        serializer=QuestSerializer(quests)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def patch(self,request,pk):
        quests=Quest.objects.get(pk=pk)
        serializer=QuestSerializer(quests,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk):
        quest=Quest.objects.get(pk=pk)
        quest.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class QuestUserView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request):
        user=request.user
        quests=Quest.objects.filter(
            Q(assigned_to=user) |
            Q(team__members__user=user)
        )
        serializer=QuestSerializer(quests,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class QuestUserAssignedView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request):
        user=request.user
        quests=Quest.objects.filter(
            created_by=user
        )
        serializer=QuestSerializer(quests,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class QuestProjectView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request,pk):
        project=Project.objects.get(pk=pk)
        quests=Quest.objects.filter(
            project=project
        )
        serializer=QuestSerializer(quests,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)