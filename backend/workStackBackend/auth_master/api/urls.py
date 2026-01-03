from django.urls import path, include
from .views import (RegisterView,LoginView,
                    LogoutView,UserView,
                    TestView,UserOfOrgView)
urlpatterns=[
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
    path('logout/',LogoutView,name='logout'),
    path('user/',UserView.as_view(),name='user-detail'),
    path('list/',TestView.as_view(),name='listem'),
]