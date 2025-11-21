from rest_framework import viewsets
from .models import City, Harbor
from .serializers import CitySerializer, HarborSerializer

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    
class HarborViewSet(viewsets.ModelViewSet):
    queryset = Harbor.objects.all()
    serializer_class = HarborSerializer
    
