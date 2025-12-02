from rest_framework import viewsets, status
from .models import CustomUser, City, Harbor, Enterprise, Trip, Vessel, TripSegment, TripStop
from .serializers import UserSerializer, CitySerializer, HarborSerializer, EnterpriseSerializer, TripSerializer, VesselSerializer, TripSegmentSerializer, TripStopSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsSelfUser, IsEnterprise, IsEnterpriseCheck

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated, IsSelfUser]
            
        return [perm() for perm in permission_classes]
    
    def _block_update(self, *args, **kwargs):
        return Response(
            {'detail': 'User update is not allowed'},
            status = status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def update(self, request, *args, **kwargs):
        return self._block_update()
        
    def partial_update(self, request, *args, **kwargs):
        return self._block_update()
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Returns the logged-in user's data.
        GET /api/users/me/
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='enterprises')  
    def get_enterprises(self, request):
        """
        Returns all enterprises associated with the authenticated user.
        GET /api/users/enterprises/
        """
        user = request.user
        enterprises = Enterprise.objects.filter(user=user, active=True)
        serializer = EnterpriseSerializer(enterprises, many=True)
        return Response(serializer.data)    
        
class EnterpriseViewSet(viewsets.ModelViewSet):
    queryset = Enterprise.objects.all()
    serializer_class = EnterpriseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'get_vessels']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsEnterprise]
        
        return [perm() for perm in permission_classes]  

    def perform_destroy(self, instance): # We don't delete enterprises. Only changes field active to false.
        instance.active = False 
        instance.save()
        
    @action(detail=True, methods=['get'], url_path='vessels', permission_classes=[AllowAny])  
    def get_vessels(self, request, pk=None):
        """
        Returns all vessels associated with a enterprise.
        GET /api/enterprises/vessels/
        """
        enterprise = self.get_object()
        vessels = Vessel.objects.filter(enterprise=enterprise, active=True)
        serializer = VesselSerializer(vessels, many=True)
        return Response(serializer.data)    
    
    @action(detail=True, methods=['get'], url_path='trips', permission_classes=[AllowAny])  
    def get_trips(self, request, pk=None):
        """
        Returns all trips associated with a enterprise.
        GET /api/enterprises/trips/
        """
        enterprise = self.get_object()
        trips = Trip.objects.filter(vessel_enterprise=enterprise)
        serializer = TripSerialize(trips, many=True)
        return Response(serializer.data)    
    
class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'], url_path='harbors')  
    def get_harbors(self, request, pk=None):
        """
        Returns all harbors associated with a city.
        GET /api/cities/harbors/
        """
        city = self.get_object()
        harbors = Harbor.objects.filter(city=city, active=True)
        serializer = HarborSerializer(harbors, many=True)
        return Response(serializer.data)    
       
class HarborViewSet(viewsets.ModelViewSet):
    queryset = Harbor.objects.all()
    serializer_class = HarborSerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]

class VesselViewSet(viewsets.ModelViewSet):
    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrive']:
            permission_classes  = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsEnterpriseCheck]
            
        return [perm() for perm in permission_classes]  

    def perform_destroy(self, instance): # We don't delete enterprises. Only changes field active to false.
        instance.active = False 
        instance.save()
        
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsEnterpriseCheck]
            
        return [perm() for perm in permission_classes] 
    
class TripStopViewSet(viewsets.ModelViewSet):
    queryset = TripStop.objects.all()
    serializer_class = TripStopSerializer
    
class TripSegmentViewSet(viewsets.ModelViewSet):
    queryset = TripSegment.objects.all()
    serializer_class = TripSegmentSerializer
    