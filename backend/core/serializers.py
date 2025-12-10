from django.db import transaction
from django.db.utils import IntegrityError
from rest_framework import serializers, status
from .models import ChoiceOptions, CustomUser, Harbor, City, Enterprise, Ticket, Trip, Vessel, TripStop, TripSegment
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['id', 'password', 'email', 'username', 'name', 'cpf', 'image']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_cpf(self, value):
        if self.instance:
            return value
        
        cpf = ''.join(filter(str.isdigit, value))

        if len(cpf) != 11:
            raise serializers.ValidationError("CPF must contain 11 digits.")

        _sum = sum(int(cpf[i]) * (10 - i) for i in range(9))
        digit1 = ((_sum * 10) % 11) % 10
        if digit1 != int(cpf[9]):
            raise serializers.ValidationError("Invalid CPF.")

        _sum = sum(int(cpf[i]) * (11 - i) for i in range(10))
        digit2 = ((_sum * 10) % 11) % 10
        if digit2 != int(cpf[10]):
            raise serializers.ValidationError("Invalid CPF.")

        return value
        
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password'],
            name = validated_data['name'],
            cpf = validated_data['cpf']
        )
        
        return user
    
    def update(self, instance, validated_data):
        allowed_fields = ['name', 'image']

        for field in allowed_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()
        return instance

class EnterpriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enterprise
        fields = '__all__'
        read_only_fields = ['user', 'active'] 
        
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['user'] = user 
        return super().create(validated_data)

class HarborSerializer(serializers.ModelSerializer):
    class Meta:
        model = Harbor
        fields = ['id', 'name', 'city']
        read_only_fields = ['active']

class CitySerializer(serializers.ModelSerializer):  
    harbors = HarborSerializer(many=True, read_only=True)
      
    class Meta:
        model = City 
        fields = ['id', 'name', 'state', 'image', 'harbors']
        read_only_fields = ['active']

class VesselSerializer(serializers.ModelSerializer):
    vessel_type = serializers.CharField()

    class Meta:
        model = Vessel 
        fields = '__all__'
        read_only_fields = ['active']
    
    def validate_enterprise(self, value):
        request = self.context['request']
        user = request.user 
        
        if value.user != user:
            raise PermissionDenied('You do not own this enterprise')
        
        return value
    
    def validate_vessel_type(self, value):
        v = value.strip().lower()
        
        mapping = {
            'barco': ChoiceOptions.VesselTypeChoices.BOAT,
            'lancha': ChoiceOptions.VesselTypeChoices.SPEED_BOAT,
            'ferry boat': ChoiceOptions.VesselTypeChoices.FERRY_BOAT
        }
        
        if v not in mapping:
            raise serializers.ValidationError('Invalid vessel type')
        
        return mapping[v]

    def validate(self, attrs):
        vessel_type = attrs.get('vessel_type') or getattr(self.instance, 'vessel_type', None)
        individual_capacity = attrs.get('individual_capacity')
        number_of_cabins = attrs.get('number_of_cabins')
        
        if individual_capacity is not None and individual_capacity <= 0:
            raise serializers.ValidationError({
                'individual_capacity': "individual_capacity must be > 0"
            })

        if vessel_type != 'SPEED_BOAT':
            if number_of_cabins is not None and number_of_cabins < 0:
                raise serializers.ValidationError({
                    'number_of_cabins': "number_of_cabins must be >= 0 when the vessel type is not 'lancha'"
                })
        else:
            if number_of_cabins not in (0, None):
                raise serializers.ValidationError({
                    'number_of_cabins': "speed boats must have 0 cabins"
             })

        return attrs


class TripStopSerializer(serializers.ModelSerializer):
    harbor = serializers.PrimaryKeyRelatedField(
        queryset=Harbor.objects.all()
    )
    class Meta:
        model = TripStop 
        fields = '__all__'
        read_only_fields = ['active', 'is_departure_stop', 'is_arrival_stop', 'number_of_lands', 'number_of_shipments']
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        ret['harbor'] = HarborSerializer(instance.harbor).data
        return ret    
        
    def get_fields(self):
        fields = super().get_fields()

        if self.instance is not None:
            fields['trip'].read_only = True

        return fields
    
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        
        try:
            instance.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)
        
        instance.save()
        return instance
            
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        try:
            instance.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)
        
        instance.save()
        return instance
        
class TripSerializer(serializers.ModelSerializer):    
    trip_stops = TripStopSerializer(many=True, read_only=True)
    vessel = serializers.PrimaryKeyRelatedField(
        queryset=Vessel.objects.all()
    )
    departure_harbor = serializers.PrimaryKeyRelatedField(
        queryset=Harbor.objects.all()
    )
    arrival_harbor = serializers.PrimaryKeyRelatedField(
        queryset=Harbor.objects.all()
    )
    
    class Meta:
        model = Trip
        fields = ['id', 'active', 'departure_datetime', 'arrival_datetime', 'departure_harbor', 'arrival_harbor', 'individual_base_price', 'cabin_base_price', 'vessel', 'trip_stops']
        read_only_fields = ['active', 'trip_stops']
        ordering_fields = ['departure_datetime']
    
    def get_fields(self):
        fields = super().get_fields()

        if self.instance is not None:
            fields['departure_datetime'].read_only = True
            fields['departure_harbor'].read_only = True
            fields['arrival_datetime'].read_only = True
            fields['arrival_harbor'].read_only = True
            
        return fields   
        
    def validate(self, attrs):
        departure_datetime = attrs.get('departure_datetime') or getattr(self.instance, 'departure_datetime')
        arrival_datetime = attrs.get('arrival_datetime') or getattr(self.instance, 'arrival_datetime')

        if arrival_datetime < departure_datetime:
            raise serializers.ValidationError({
                'arrival_datetime': "arrival_datetime must be after departure_datetime."
            })      
             
        return attrs
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        ordered_stops = sorted(
            data['trip_stops'],
            key=lambda stop: stop['stop_datetime']
        )

        data['trip_stops'] = ordered_stops
        data['vessel'] = VesselSerializer(instance.vessel).data
        data['departure_harbor'] = HarborSerializer(instance.departure_harbor).data
        data['arrival_harbor'] = HarborSerializer(instance.arrival_harbor).data
        return data
    
    def update(self, instance, validated_data):
        validated_data.pop('departure_datetime')
        validated_data.pop('arrival_datetime')
        
        return super().update(instance, validated_data)

class ListAllTripSerializer(serializers.ModelSerializer):
    trip_stops = TripStopSerializer(many=True, read_only=True)
    vessel = VesselSerializer(read_only=True)
    arrival_harbor = HarborSerializer(read_only=True)
    departure_harbor = HarborSerializer(read_only=True)
    
    class Meta:
        model = Trip
        fields = ['id', 'active', 'departure_datetime', 'arrival_datetime', 'departure_harbor', 'arrival_harbor', 'individual_base_price', 'cabin_base_price', 'vessel', 'trip_stops']

class EnterpriseMeSerializer(serializers.ModelSerializer):
    vessels_count = serializers.SerializerMethodField()

    class Meta:
        model = Enterprise
        fields = ['id', 'fantasy_name', 'cnpj', 'image', 'vessels_count']

    def get_vessels_count(self, obj):
        return obj.vessels.count()   

class UserMeSerializer(serializers.ModelSerializer):
    cpf = serializers.SerializerMethodField()
    enterprises = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'name', 'cpf', 'image', 'enterprises']

    def get_cpf(self, obj):
        if not obj.cpf:
            return None
        
        return f"***.{obj.cpf[3:6]}.***-{obj.cpf[-2:]}"
    
    def get_enterprises(self, obj):
        active_enterprises = obj.enterprises.filter(active=True)
        return EnterpriseMeSerializer(active_enterprises, many=True).data
    
class TripSegmentSerializer(serializers.ModelSerializer):
    from_stop = TripStopSerializer()
    to_stop = TripStopSerializer()
    trip = serializers.PrimaryKeyRelatedField(
        queryset=Trip.objects.all()
    )

    class Meta:
        model = TripSegment
        fields = '__all__'
        
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['trip'] = TripSerializer(instance.trip).data
        return rep   
        
class TicketSerializer(serializers.ModelSerializer):
    passenger = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all()
    )
    trip_segment = serializers.PrimaryKeyRelatedField(
        queryset=TripSegment.objects.all()
    )
    
    class Meta:
        model = Ticket 
        fields = '__all__'
        read_only_fields = ['active']
        
    def to_representation(self, instance):
        rep = super().to_representation(instance)

        rep['passenger'] = UserSerializer(instance.passenger).data
        rep['trip_segment'] = TripSegmentSerializer(instance.trip_segment).data

        return rep    
        
    def validate(self, attrs):
        if not self.instance:
            trip_segment = attrs['trip_segment']
            from_stop = trip_segment.from_stop
            to_stop = trip_segment.to_stop
            trip = trip_segment.trip
            
            if not trip.can_sell_ticket(from_stop, to_stop):
                raise serializers.ValidationError({
                    "detail": "Exceed capacity."
                })
            
        return attrs