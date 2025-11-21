from rest_framework import viewsets
from .models import CustomUser, City, Harbor, Enterprise, Customer
from .serializers import UserSerializer, CitySerializer, HarborSerializer, EnterpriseSerializer, CustomerSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class EnterpriseViewSet(viewsets.ModelViewSet):
    queryset = Enterprise.objects.all()
    serializer_class = EnterpriseSerializer

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    
class HarborViewSet(viewsets.ModelViewSet):
    queryset = Harbor.objects.all()
    serializer_class = HarborSerializer
    
class EnterpriseViewSet(viewsets.ModelViewSet):
    queryset = Enterprise.objects.all()
    serializer_class = EnterpriseSerializer
    
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer