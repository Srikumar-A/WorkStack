from django.urls import path
from .views import ProjectListView,ProjectDetailView,ProjectPermissionView


urlpatterns=[
    path('list/',ProjectListView.as_view(),name='project-list'),
    path('<int:pk>/',ProjectDetailView.as_view(),name='project-detail'),
    path('permissions/<int:pk>/',ProjectPermissionView.as_view(),name='permissions'),
]