from decimal import Decimal
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.
class BaseModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        abstract = True
        
class ChoiceOptions():
    class VesselTypeChoices(models.TextChoices):
        BOAT = ('BOAT', 'Barco') 
        SPEED_BOAT = ('SPEED_BOAT', 'Lancha')
        FERRY_BOAT = ('FERRY_BOAT', 'Ferry Boat')
        
    class TypeOfAccommodationChoices(models.TextChoices):
        INDIVIDUAL = ('I', 'Individual')
        CABIN = ('C', 'Cabin')
        
    class PaymentMethodChoices(models.TextChoices):
        PIX = ('P', 'Pix')
        MONEY = ('M', 'Money')
        CARD = ('C', 'Card')
        OTHER = ('O', 'Other')
        
    class PaymentStatusChoices(models.TextChoices):
        DONE = ('D', 'Done')
        WAITING = ('W', 'Waiting')
        CANCELED = ('C', 'Canceled')
        
    class TicketStatusChoices(models.TextChoices):
        RESERVED = ('Reserved')
        CONFIRMED = ('Confirmed')
        CANCELED = ('Canceled')
        
class CustomUser(AbstractUser):
    name = models.CharField(max_length=50, null=False, blank=False)
    cpf = models.CharField(max_length=20, null=False, blank=False)
    image = models.ImageField(upload_to='assets/users/', null=True, blank=True, default=None)
        
class Enterprise(BaseModel):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='enterprises'
    )
    fantasy_name = models.CharField(max_length=50, null=False, blank=False)
    cnpj = models.CharField(max_length=20, null=False, blank=False)
    image = models.ImageField(upload_to='assets/enterprises/', null=False, blank=False)
    
    class Meta:
        db_table = 'enterprise'
        managed = True
            
class Vessel(BaseModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    image = models.ImageField(upload_to='assets/vessels/', null=False, blank=False)
    registry_code = models.CharField(max_length=50, null=False, blank=False)
    vessel_type = models.CharField(max_length=20, null=False, choices=ChoiceOptions.VesselTypeChoices.choices)
    individual_capacity = models.IntegerField(null=False, blank=False)
    number_of_cabins = models.IntegerField(default=0)
    enterprise = models.ForeignKey(
        to='Enterprise',
        on_delete=models.PROTECT,
        related_name='vessels',
        null=False,
        db_column='id_enterprise'
    )
    
    class Meta:
        db_table = 'vessel'
        managed = True  
        
class City(BaseModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    state = models.CharField(max_length=50, null=False, blank=False)
    image = models.ImageField(upload_to='assets/cities/', null=False, blank=False)
    
    class Meta:
        db_table = 'city'
        managed = True
        
    def __str__(self):
        return f'{self.name}-{self.state}'
    
class Harbor(BaseModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    city = models.ForeignKey(
        to='City',
        on_delete=models.PROTECT,
        related_name='harbors',
        null=False,
        db_column='id_city'    
    )
    
    def __str__(self):
        return self.name
    
class Trip(BaseModel):
    departure_harbor = models.ForeignKey(
        to='Harbor',
        on_delete=models.PROTECT,
        null=False,
        related_name='departing_trips',
        db_column='id_departure_harbor'    
    )
    departure_datetime = models.DateTimeField(null=False, blank=False)
    arrival_harbor = models.ForeignKey(
        to='Harbor',
        on_delete=models.PROTECT,
        null=False,
        related_name='arriving_trips',
        db_column='id_arrival_harbor'
    )
    arrival_datetime = models.DateTimeField(null=False, blank=False)
    vessel = models.ForeignKey(
        to='Vessel',
        on_delete=models.PROTECT,
        related_name='trips',
        null=False,
        db_column='id_vessel'
    )
    individual_base_price =  models.DecimalField(null=False, decimal_places=2, max_digits=6)
    cabin_base_price = models.DecimalField(decimal_places=2, max_digits=6, default=0)
    
    def can_sell_ticket(self, from_stop, to_stop):
        trip_stops = TripStop.objects.filter(trip=self).order_by('stop_datetime')
        passengers = 0
        
        for ts in trip_stops:
            passengers += ts.number_of_shipments
            passengers -= ts.number_of_landings
                        
            if ts.stop_datetime >= from_stop.stop_datetime and ts.stop_datetime < to_stop.stop_datetime:
                if passengers >= self.vessel.individual_capacity:
                    return False
        
        return True
    
    class Meta:
        db_table = 'trip'
        managed = True
    
class TripStop(BaseModel):
    trip = models.ForeignKey(
        to='Trip',
        on_delete=models.CASCADE,
        null=False,
        related_name='trip_stops',
        db_column='id_trip'            
    )
    harbor = models.ForeignKey(
        to='Harbor',
        on_delete=models.PROTECT,
        null=False,
        related_name='harbors',
        db_column='id_harbor'
    )
    stop_datetime = models.DateTimeField(null=False, blank=False)
    number_of_shipments = models.IntegerField(default=0)
    number_of_landings = models.IntegerField(default=0)
    is_departure_stop = models.BooleanField(default=False)
    is_arrival_stop = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if self.pk:
            old = TripStop.objects.get(pk=self.pk)
            old_datetime = old.stop_datetime
            old_harbor = old.harbor

            new_datetime = self.stop_datetime
            new_harbor = self.harbor

            trip = self.trip

            # Datetime changes
            if old_datetime != new_datetime:
                if self.is_departure_stop:
                    trip.departure_datetime = new_datetime
                elif self.is_arrival_stop:
                    trip.arrival_datetime = new_datetime
                trip.save()

            # Harbor changes
            if old_harbor != new_harbor:
                if self.is_departure_stop:
                    trip.departure_harbor = new_harbor
                elif self.is_arrival_stop:
                    trip.arrival_harbor = new_harbor
                trip.save()

        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        if self.is_departure_stop:
            raise ValidationError({
                "detail": "You can't delete the departure stop"
                })
        
        if self.is_arrival_stop:
            raise ValidationError({
                "detail": "You can't delete arrival stop"
                })

        if self.number_of_landings > 0 or self.number_of_shipments > 0:
            raise ValidationError({
                "detail:" "You can't delete a trip stop if someone boards or disembarks at it."
                })
            
        super().delete(*args, **kwargs)
    
    def clean(self):
        if self.pk:
            self._validate_stop_datetime_on_update()
            self._validate_harbor_on_update()
        else:
            self._validate_stop_datetime_on_create()
            
    def _validate_stop_datetime_on_update(self):
        old = TripStop.objects.get(pk=self.pk)
        new_datetime = self.stop_datetime
            
        stops = self.trip.trip_stops.exclude(pk=self.pk).order_by("stop_datetime")
        prev_stop = stops.filter(stop_datetime__lt=old.stop_datetime).last()
        next_stop = stops.filter(stop_datetime__gt=old.stop_datetime).first()
        
        if prev_stop and new_datetime < prev_stop.stop_datetime:
            raise ValidationError({
                "stop_datetime": "You can't update stop_datetime to a datetime earlier than the previous stop."
            })

        if next_stop and new_datetime > next_stop.stop_datetime:
            raise ValidationError({
                "stop_datetime": "You can't update stop_datetime to a datetime later than the next stop."
            })
            
    def _validate_stop_datetime_on_create(self):
        if self.stop_datetime < self.trip.departure_datetime or self.stop_datetime > self.trip.arrival_datetime:
            raise ValidationError({
                "stop_datetime": "stop_datetime must be after departure_datetime and before arrival_datetime."
            }) 
            
    def _validate_harbor_on_update(self):
        old = TripStop.objects.get(pk=self.pk)
        
        if self.harbor.city != old.harbor.city:
            raise ValidationError({
                "harbor": "You can only update harbor if the city remains the same."
            }) 
            
    class Meta:
        db_table = 'trip_stop'
        managed = True
    
class TripSegment(BaseModel):
    trip = models.ForeignKey(
        to='Trip',
        on_delete=models.CASCADE,
        null=False,
        related_name='trip_segments',
        db_column='id_trip'            
    )
    from_stop = models.ForeignKey(
        to='TripStop',
        on_delete=models.CASCADE,
        null=False,
        related_name='from_stop', # apenas para não dar conflito, nem será usado
        db_column='id_from_stop'
    )
    to_stop = models.ForeignKey(
        to='TripStop',
        on_delete=models.CASCADE,
        null=False,
        related_name='to_stop', # apenas para não dar conflito, nem será usado
        db_column='id_to_stop'
    )
    individual_price = models.DecimalField(default=0, decimal_places=2, max_digits=6)
    
    def calculate_price(self):
        total_trip_time = (self.trip.arrival_datetime - self.trip.departure_datetime).total_seconds()
        total_segment_time = (self.to_stop.stop_datetime - self.from_stop.stop_datetime).total_seconds()
        proportion = total_segment_time / total_trip_time
        price = self.trip.individual_base_price * Decimal(proportion)
        add = price * Decimal(0.1)
        
        self.individual_price = min(price + add, self.trip.individual_base_price)
        self.save()
    
    class Meta:
        db_table = 'trip_segment'
        managed = True
        
class Payment(BaseModel):
    payment_method = models.CharField(max_length=1, null=False, blank=False, choices=ChoiceOptions.PaymentMethodChoices.choices)
    payment_status = models.CharField(max_length=1, null=False, blank=False, choices=ChoiceOptions.PaymentStatusChoices.choices)
    paid_at = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2)
    
    class Meta:
        db_table = 'payment'
        managed = True

class Ticket(BaseModel):
    trip_segment = models.ForeignKey(
        to='TripSegment',
        on_delete=models.PROTECT,
        null=False,
        related_name='tickets',
        db_column='id_trip_segment'
    )
    type_of_accommodation = models.CharField(max_length=1, default=ChoiceOptions.TypeOfAccommodationChoices.INDIVIDUAL, blank=False, choices=ChoiceOptions.TypeOfAccommodationChoices.choices)
    passenger = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=False,
        related_name='tickets',
        db_column='id_passenger',
        default=1
    )
    price = models.DecimalField(decimal_places=2, max_digits=6, default=0)
    status = models.CharField(max_length=10, default='Reserved', choices=ChoiceOptions.TicketStatusChoices.choices)

    class Meta:
        db_table = 'ticket'
        managed = True
