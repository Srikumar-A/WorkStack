from django.urls import path
from .views import (TeamView,testView,TeamDetailView,
                    UpdateTeamMemberView,TeamFromOrganizationView,
                    TeamMembershipUserView)
urlpatterns=[
    path('',TeamView.as_view(),name='teams'),
    path('list/',testView.as_view(),name='list-Teams'),#remove this
    path('<int:pk>/',TeamDetailView.as_view(),name='team-detail'),
    path('<int:pk>/<int:membership_id>/',UpdateTeamMemberView.as_view(),name="update-members"),
    path('org/',TeamFromOrganizationView.as_view(),name='org-teams'),
    path('<int:team_id>/members/',TeamMembershipUserView.as_view(),name="members-ofTeam")
]