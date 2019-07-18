from django.urls import path
from core import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('api/auth/user/', csrf_exempt(views.get_authenticated_user)),
    path('api/auth/register/', csrf_exempt(views.RegisterView.as_view())),
    path('api/users/', csrf_exempt(views.UserListView.as_view())),
    path('api/users/<int:pk>/', csrf_exempt(views.UserDetailView.as_view())),
    path('api/pages/', csrf_exempt(views.PageListView.as_view())),
    path('api/pages/<int:pk>/', csrf_exempt(views.PageDetailView.as_view())),
    path('api/pages/<int:page_pk>/components/', csrf_exempt(views.ComponentListView().as_view())),
    path('api/pages/<int:page_pk>/components/<int:comp_pk>/', csrf_exempt(views.ComponentDetailView().as_view())),
    
    path('', views.hall, name='hall'),
    path('login/', views.login, name='login'),
    path('logon/', views.logon, name='logon'),
    path('<str:username>/', views.dashboard, name='dashboard'),
    
    path('accounts/profile/', views.loginredirect, name='loginredirect'),
]
