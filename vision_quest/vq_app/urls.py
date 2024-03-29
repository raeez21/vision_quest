from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # path('members/', views.members, name='members'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    # path('login/', auth_views.LoginView.as_view(), name='login'),
    # path('analyze/', views.AnalyzeView.as_view(), name='analyze'),
    path('analyze/',views.analyze, name='analyze'),
    path('results/',views.results, name = 'results'),
    path('profile/', views.profile, name='profile'),
]