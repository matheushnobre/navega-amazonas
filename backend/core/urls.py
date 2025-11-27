from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, CityViewSet, HarborViewSet, EnterpriseViewSet, TripViewSet, VesselViewSet

router = DefaultRouter()
router.register('cities', CityViewSet, basename="city")
router.register('harbors', HarborViewSet, basename="harbor")
router.register('enterprises', EnterpriseViewSet, basename='enterprise')
router.register('users', UserViewSet, basename='user')
router.register('vessels', VesselViewSet, basename='vessel')
router.register('trips', TripViewSet, basename='trip')

urlpatterns = [
    path("api/", include(router.urls)),
]
