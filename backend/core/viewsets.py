from rest_framework import viewsets
from .models import CustomUser, City, Harbor, Enterprise, Customer, Trip, Vessel
from .serializers import UserSerializer, CitySerializer, HarborSerializer, EnterpriseSerializer, CustomerSerializer, TripSerializer, VesselSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsSelfUser, IsEnterprise

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Returns the logged-in user's data.
        GET /api/users/me/
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
        

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    
    def get_permissions(self):
        if self.action in ['list']:
            return [AllowAny()]
        return [IsAuthenticated()]  
       
class HarborViewSet(viewsets.ModelViewSet):
    queryset = Harbor.objects.all()
    serializer_class = HarborSerializer
    
    def get_permissions(self):
        if self.action in ['list']:
            return [AllowAny()]
        return [IsAuthenticated()]  
    
class EnterpriseViewSet(viewsets.ModelViewSet):
    queryset = Enterprise.objects.all()
    serializer_class = EnterpriseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'list']:
            return [AllowAny()]
        return [IsAuthenticated(), IsSelfUser()]    

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action == 'list':
            return [IsAuthenticated()]
        
        return [IsAuthenticated(), IsSelfUser()]    
    
class VesselViewSet(viewsets.ModelViewSet):
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        
        return [IsAuthenticated(), IsEnterprise()]

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    