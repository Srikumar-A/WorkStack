from django.urls import path
from .views import OrganizationView,OrganizationDetailView

urlpatterns=[
    path('organizations/',OrganizationView.as_view(),name='organization-list'),
    path('organizations/<int:pk>/',OrganizationDetailView.as_view(),name='organization-details'),
]