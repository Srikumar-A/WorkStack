from django.urls import path
from .views import (OrganizationView,OrganizationDetailView,
                    OrganizationUserView,OrganizationMembershipView,
                    OrgMembershipRequestsView)

urlpatterns=[
    path('organizations/',OrganizationView.as_view(),name='organization-list'),
    path('organizations/<int:pk>/',OrganizationDetailView.as_view(),name='organization-details'),
    path('',OrganizationUserView.as_view(),name="user-organization"),
    path('org-memberships/',OrganizationMembershipView.as_view(),name="org-memberships"),
    path('org-mem-req/',OrgMembershipRequestsView.as_view(),name="org-mem-requests")
]