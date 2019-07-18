from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken import views

from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api-token-auth/', views.obtain_auth_token, name='api-token-auth'),
]

urlpatterns += [
    path('', include('core.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
