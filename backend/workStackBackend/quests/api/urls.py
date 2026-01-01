from django.urls import path
from .views import QuestView,QuestDetailView,QuestUserView

urlpatterns=[
    path('',QuestUserView.as_view(),name='user-quests'),
    path('<int:proj_id>/',QuestView.as_view(),name='quest-list'),
    path('quest-detail/<int:pk>/',QuestDetailView.as_view(),name='quest-detail'),
]