from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, CityViewSet, HarborViewSet, EnterpriseViewSet, CustomerViewSet

router = DefaultRouter()
router.register('cities', CityViewSet, basename="city")
router.register('harbors', HarborViewSet, basename="harbor")
router.register('enterprises', EnterpriseViewSet, basename='enterprise')
router.register('users', UserViewSet, basename='user')
router.register('customers', CustomerViewSet, basename='customer')

urlpatterns = [
    path("api/", include(router.urls)),
]
