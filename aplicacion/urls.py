from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('run-bot/', views.run_bot, name='run_bot'),
]