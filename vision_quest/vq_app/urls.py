from django.urls import path
from . import views

urlpatterns = [
    path('members/', views.members, name='members'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
]