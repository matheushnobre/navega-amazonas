from rest_framework import viewsets, status
from .models import CustomUser, City, Harbor, Enterprise, Trip, TripSegment, Vessel, TripStop
from .serializers import UserSerializer, UserMeSerializer, CitySerializer, HarborSerializer, EnterpriseSerializer, TripSerializer, ListAllTripSerializer, VesselSerializer, TripStopSerializer, TripSegmentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsSelfUser, IsEnterprise, IsEnterpriseCheck
from django.db.models.deletion import ProtectedError
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError

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
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Returns the logged-in user's data.
        GET /api/users/me/
        """
        user = request.user
        serializer = UserMeSerializer(user)
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
    queryset = Enterprise.objects.all().filter(active=True)
    serializer_class = EnterpriseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'get_vessels']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsEnterprise]
        
        return [perm() for perm in permission_classes]  
    
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
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
    queryset = City.objects.all().filter(active=True)
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
    queryset = Harbor.objects.all().filter(active=True)
    serializer_class = HarborSerializer
    http_method_names = ['get']
    permission_classes = [AllowAny]

class VesselViewSet(viewsets.ModelViewSet):
    queryset = Vessel.objects.all().filter(active=True)
    serializer_class = VesselSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrive']:
            permission_classes  = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsEnterpriseCheck]
            
        return [perm() for perm in permission_classes]   
    
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            instance.active = False
            instance.save()
    
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all().order_by('departure_datetime').filter(active=True)
    serializer_class = TripSerializer
    
    def get_permissions(self):
        if self.action in ['retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
            
        return [perm() for perm in permission_classes] 
    
    def list(self, request, *args, **kwargs):
        self.serializer_class = ListAllTripSerializer
        return super().list(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'], url_path='trip_stops')  
    def get_trip_stops(self, request, pk=None):
        """
        Returns all trip_stops associated with a trip.
        GET /api/trips/trip_stops
        """
        trip = self.get_object()
        trip_stops = trip.trip_stops.order_by('stop_datetime')
        serializer = TripStopSerializer(trip_stops, many=True)
        return Response(serializer.data)    
    

class TripStopViewSet(viewsets.ModelViewSet):
    queryset = TripStop.objects.all().filter(active=True)
    serializer_class = TripStopSerializer
    
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict)
    
class TripSegmentViewSet(viewsets.ModelViewSet):
    queryset = TripSegment.objects.all().filter(active=True)
    serializer_class = TripSegmentSerializer