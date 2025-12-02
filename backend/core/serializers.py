from django.db import transaction
from django.db.utils import IntegrityError
from rest_framework import serializers, status
from .models import ChoiceOptions, CustomUser, Harbor, City, Enterprise, Trip, Vessel, TripStop, TripSegment
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['id', 'password', 'email', 'username', 'name', 'cpf']
        extra_kwargs = {
            'password': {'write_only': True},
        }

            
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password'],
            name = validated_data['name'],
            cpf = validated_data['cpf']
        )
        
        return user

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
        
class CitySerializer(serializers.ModelSerializer):    
    class Meta:
        model = City 
        fields = ['id', 'name', 'state', 'image']
        
class HarborSerializer(serializers.ModelSerializer):
    city = CitySerializer()
    
    class Meta:
        model = Harbor
        fields = ['id', 'name', 'city']

class VesselSerializer(serializers.ModelSerializer):
    vessel_type = serializers.CharField()
    
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
        
    class Meta:
        model = Vessel 
        fields = '__all__'
        read_only_fields = ['active']

class TripSerializer(serializers.ModelSerializer):            
    class Meta:
        model = Trip
        fields = '__all__'
        
class TripStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripStop 
        fields = '__all__'
        
class TripSegmentSerializer(serializers.ModelSerializer):            
    class Meta:
        model = TripSegment
        fields = '__all__'
        
class EnterpriseMeSerializer(serializers.ModelSerializer):
    vessels_count = serializers.SerializerMethodField()

    class Meta:
        model = Enterprise
        fields = ['id', 'fantasy_name', 'cnpj', 'vessels_count']

    def get_vessels_count(self, obj):
        return obj.vessels.count()   

class UserMeSerializer(serializers.ModelSerializer):
    cpf = serializers.SerializerMethodField()
    enterprises = EnterpriseMeSerializer(many=True)  # ajuste conforme seu modelo

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'name', 'cpf', 'enterprises']

    def get_cpf(self, obj):
        if not obj.cpf:
            return None
        
        return f"***.{obj.cpf[3:6]}.***-{obj.cpf[-2:]}"