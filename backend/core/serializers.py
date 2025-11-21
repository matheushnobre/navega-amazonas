from django.db import transaction
from django.db.utils import IntegrityError
from rest_framework import serializers
from .models import CustomUser, Harbor, City, Enterprise, Customer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['id', 'password', 'username', 'email']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email already exists.')
        return value

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
                username = user_data['email']
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

