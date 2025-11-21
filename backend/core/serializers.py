from rest_framework import serializers
from .models import Harbor, City

class HarborSerializer(serializers.ModelSerializer):
    class Meta:
        model = Harbor
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    harbors = HarborSerializer(many=True, read_only=True)
    
    class Meta:
        model = City 
        fields = '__all__'
        