from django.db import transaction
from django.db.utils import IntegrityError
from rest_framework import serializers, status
from .models import CustomUser, Harbor, City, Enterprise, Trip, Vessel
from rest_framework.response import Response

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
        read_only_fields = ['user']
        
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['user'] = user 
        return super().create(validated_data)
        
class HarborSerializer(serializers.ModelSerializer):
    class Meta:
        model = Harbor
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    harbors = HarborSerializer(many=True, read_only=True)
    
    class Meta:
        model = City 
        fields = '__all__'

class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel 
        fields = '__all__'
        read_only_fields = ['enterprise']
        
    def create(self, validated_data):
        # It's not possible to create an vessel of another enterprise.
        request = self.context['request']
        validated_data['enterprise'] = request.user.enterprise_profile
        return super().create(validated_data)


class TripSerializer(serializers.ModelSerializer):
    departure_harbor = serializers.StringRelatedField()
    arrival_harbor = HarborSerializer()
    vessel = VesselSerializer()
    
    class Meta:
        model = Trip
        fields = '__all__'