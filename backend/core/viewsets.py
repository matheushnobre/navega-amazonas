from datetime import datetime, time
from rest_framework import viewsets, status
from .models import CustomUser, City, Harbor, Enterprise, Ticket, Trip, TripSegment, Vessel, TripStop
from .serializers import TicketSerializer, UserSerializer, UserMeSerializer, CitySerializer, HarborSerializer, EnterpriseSerializer, TripSerializer, ListAllTripSerializer, VesselSerializer, TripStopSerializer, TripSegmentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsSelfUser, IsEnterprise, IsEnterpriseCheck
from django.db.models.deletion import ProtectedError
from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone

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
    queryset = City.objects.all().filter(active=True).order_by('name')
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
    
    @action(detail=False, methods=['get'], url_path='from_to')  
    def get_trips_segments_from_a_city_to_another(self, request, pk=None):
        arrival_city = request.query_params.get('arrival_city')
        departure_city = request.query_params.get('departure_city')
        date = request.query_params.get('date')
     
        if not arrival_city or not departure_city:
            raise serializers.ValidationError({
                "detail": "arrival_city and departure_city are mandatory."
            })
            
        if not date:
            date = timezone.localdate()
        else:
            try:
                date = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                raise serializers.ValidationError({
                    "date": "Invalid format. Use YYYY-MM-DD."
                })
                
                
        trip_segments = TripSegment.objects.all().filter(
            from_stop__harbor__city=arrival_city,
            to_stop__harbor__city=departure_city,
            from_stop__stop_datetime__date=date
        ).order_by('-from_stop__stop_datetime')
    
        serializer = TripSegmentSerializer(trip_segments, many=True)
        return Response(serializer.data)    
    
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer