from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from ..models import teams,team_members
from .serializers import (TeamSerializer,CreateTeamSerializer,
                          TeamMembersSerializer,TeamDetailSerializer,
                          TeamMemberRoleUpdateSerializer,
                          TeamMemberUserSerializer)
from rest_framework.permissions import IsAuthenticated
from organization.models import organization
from django.db import transaction


#adding view to update and delete the user membership
def is_team_lead(user,team):
    return team_members.objects.filter(
        team=team,
        user=user,
        role="lead"
    ).exists()
# Create your views here.
class TeamView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request):
        user=request.user
        teamsList=teams.objects.filter(
            members__user=user
        )
        serialzier=TeamSerializer(teamsList,many=True)
        return Response(serialzier.data,status=status.HTTP_200_OK)
    @transaction.atomic
    def post(self,request):
        serializer=CreateTeamSerializer(data=request.data)
        if serializer.is_valid():
            team=serializer.save(
                organization=request.user.organization
            )
            team_members.objects.create(
                team=team,
                user=request.user,
                role="lead"
            )
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class testView(APIView):
    def get(self,request):
        teams_=teams.objects.all()
        serializer=TeamSerializer(teams_,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class TeamDetailView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request,pk):
        team=teams.objects.get(pk=pk)
        serializer=TeamDetailSerializer(team)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request,pk):
        '''
        This one is for adding team members and updating the team details
        '''
        team=teams.objects.get(pk=pk)
        # check if the current user is lead or something else
        if is_team_lead(request.user,team):
            #authorize the user to add users to the list
            serializer=TeamMembersSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(team=team)
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        return Response({"message":"Access revoked, you are not the team lead."},status=status.HTTP_403_FORBIDDEN)
    
    def patch(self,request,pk):
        team=teams.objects.get(pk=pk)
        serializer=TeamDetailSerializer(team,data=request.data,partial=True)
        if is_team_lead(request.user,team):
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        return Response({"message":"Access revoked"},status=status.HTTP_403_FORBIDDEN)

    def delete(self,request,pk):
        team=teams.objects.get(pk=pk)
        if is_team_lead(request.user,team):
            team.delete()
            return Response({"message":"successfully deleted Team"},
                        status=status.HTTP_204_NO_CONTENT)
        return Response({"message":"access revoked"},
                        status=status.HTTP_403_FORBIDDEN)
    



class UpdateTeamMemberView(APIView):
    def patch(self,request,pk,membership_id):
        team=teams.objects.get(pk=pk)
        if is_team_lead(request.user,team=team):
            teamMembership=team_members.objects.get(
                id=membership_id,
                team=team
            )
            serializer=TeamMemberRoleUpdateSerializer(teamMembership,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
    def delete(self,request,pk,membership_id):
        team=teams.objects.get(pk=pk)
        if is_team_lead(request.user,team):
            membership=team_members.objects.get(
                id=membership_id,
                team=team
            )

            # cant remove last lead
            if membership.role=="lead":
                lead_count=team_members.objects.filter(
                    team=team,
                    role="lead"
                ).count()

                if lead_count<=1:
                    return Response({"detail":"cannot remove last lead from team"},
                                    status=status.HTTP_400_BAD_REQUEST)
                
            membership.delete()
            return Response({"message":"Successfully deleted."},status=status.HTTP_204_NO_CONTENT)
        return Response({"message":f"Lead{is_team_lead(request.user,team)}"},status=status.HTTP_401_UNAUTHORIZED)
    

class TeamFromOrganizationView(APIView):
    permission_classes=[IsAuthenticated,]
    def get(self,request):
        team_=teams.objects.filter(
            organization=request.user.organization,
        ).distinct()
        serializer=TeamSerializer(team_,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class TeamMembershipUserView(APIView):
    permission_classes=[IsAuthenticated,]

    def get(self,request,team_id):
        memberships=team_members.objects.filter(
            team=team_id,
            team__organization=request.user.organization
        ).select_related("user")
        serializer=TeamMemberUserSerializer(memberships,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    