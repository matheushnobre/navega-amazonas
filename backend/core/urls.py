from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import CityViewSet, HarborViewSet

router = DefaultRouter()
router.register('cities', CityViewSet, basename="city")
router.register('harbors', HarborViewSet, basename="harbor")

urlpatterns = [
    path("api/", include(router.urls)),
]
