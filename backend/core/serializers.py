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
        fields = ['id', 'password', 'email', 'username', 'name', 'cpf', 'image']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_cpf(self, value):
        if self.instance:
            return value
        
        cpf = ''.join(filter(str.isdigit, value))

        if len(cpf) != 11:
            raise serializers.ValidationError("CPF deve conter 11 dígitos.")

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

        print(vessel_type)
        print(individual_capacity)
        print(number_of_cabins)
        
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
        fields = ['id', 'fantasy_name', 'cnpj', 'image', 'vessels_count']

    def get_vessels_count(self, obj):
        return obj.vessels.count()   

class UserMeSerializer(serializers.ModelSerializer):
    cpf = serializers.SerializerMethodField()
    enterprises = EnterpriseMeSerializer(many=True)  # ajuste conforme seu modelo

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'name', 'cpf', 'image', 'enterprises']

    def get_cpf(self, obj):
        if not obj.cpf:
            return None
        
        return f"***.{obj.cpf[3:6]}.***-{obj.cpf[-2:]}"