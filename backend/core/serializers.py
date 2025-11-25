from django.db import transaction
from django.db.utils import IntegrityError
from rest_framework import serializers
from .models import CustomUser, Harbor, City, Enterprise, Customer, Trip, Vessel

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['id', 'password', 'email', 'username', 'type_user', 'groups', 'user_permissions']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class EnterpriseSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Enterprise
        fields = '__all__'
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
    
        user = CustomUser.objects.create_user(
            password = user_data['password'],
            email = user_data['email'],
            username = user_data['email'],
            type_user = 'E'
        )     
        
        enterprise = Enterprise.objects.create(user=user, **validated_data)        
        return enterprise
        
class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Customer
        fields = ['document', 'user']
      
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        
        user = CustomUser.objects.create_user(
            password = user_data['password'],
            email = user_data['email'],
            username = user_data['email']
        )     
           
        customer = Customer.objects.create(user=user, **validated_data)        
        return customer
    
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