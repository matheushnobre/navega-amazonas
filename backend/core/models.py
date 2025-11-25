from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

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
        BOAT = ('B', 'Boat') # barco
        SPEED_BOAT = ('S', 'Speed Boat') # lancha
        FERRY_BOAT = ('F', 'Ferry Boat') # ferry boat
        
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
    
    class UserTypeChoices(models.TextChoices):
        ENTERPRISE = ('E', 'Enterprise')
        CUSTOMER = ('C', 'Customer')
        
    class TicketStatusChoices(models.TextChoices):
        RESERVED = ('Reserved')
        CONFIRMED = ('Confirmed')
        CANCELED = ('Canceled')
        
class CustomUser(AbstractUser):
    type_user = models.CharField(max_length=1, choices=ChoiceOptions.UserTypeChoices.choices, default='C')    
        
class Enterprise(models.Model):
    user = models.OneToOneField(
        to=settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='enterprise_profile'
    )
    fantasy_name = models.CharField(max_length=50, null=False, blank=False)
    document = models.CharField(max_length=20, null=False, blank=False, unique=True)
    image = models.ImageField(upload_to='assets/enterprises/', null=False, blank=False)
    
    class Meta:
        db_table = 'Enterprise'
        managed = True

class Customer(models.Model):
    user = models.OneToOneField(
        to=settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='customer_profile'
    )
    name = models.CharField(max_length=50, null=False, blank=False)
    document = models.CharField(max_length=50, null=False, blank=False, unique=True)  
      
    class Meta:
        db_table = 'customer'
        managed = True
            
class Vessel(BaseModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    image = models.ImageField(upload_to='assets/vessels/', null=False, blank=False)
    registry_code = models.CharField(max_length=50, null=False, blank=False)
    vessel_type = models.CharField(max_length=1, null=False, choices=ChoiceOptions.VesselTypeChoices.choices)
    individual_capacity = models.IntegerField(null=False, blank=False)
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

class Cabin(BaseModel):
    capacity = models.IntegerField(null=False, blank=False)
    description = models.CharField(max_length=200, null=False, blank=False)
    vessel = models.ForeignKey(
        to='Vessel',
        on_delete=models.CASCADE,
        related_name='cabins',
        null=False,
        db_column='id_vessel'        
    )
    
    class Meta:
        db_table = 'cabin'
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
    base_price =  models.DecimalField(null=False, decimal_places=2, max_digits=6)
    
    class Meta:
        db_table = 'trip'
        managed = True
    
class TripStop(BaseModel):
    trip = models.ForeignKey(
        to='Trip',
        on_delete=models.PROTECT,
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
    number = models.DecimalField(null=False, decimal_places=2, max_digits=6)
    
    class Meta:
        db_table = 'trip_stop'
        managed = True
    
class TripSegment(BaseModel):
    trip = models.ForeignKey(
        to='Trip',
        on_delete=models.PROTECT,
        null=False,
        related_name='trip_segments',
        db_column='id_trip'            
    )
    from_stop = models.ForeignKey(
        to='TripStop',
        on_delete=models.PROTECT,
        null=False,
        related_name='from_stop', # apenas para não dar conflito, nem será usado
        db_column='id_from_stop'
    )
    to_stop = models.ForeignKey(
        to='TripStop',
        on_delete=models.PROTECT,
        null=False,
        related_name='to_stop', # apenas para não dar conflito, nem será usado
        db_column='id_to_stop'
    )
    price = models.DecimalField(default=0, decimal_places=2, max_digits=6)
    individual_vacancies = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'trip_segment'
        managed = True
    
class Passenger(BaseModel):
    name = models.CharField(max_length=50, null=False, blank=False)
    document = models.CharField(max_length=30, null=False, blank=False, unique=True)
    birthday = models.DateField(null=False, blank=False)
    
    class Meta:
        db_table = 'passenger'
        managed = True 
        
class Payment(BaseModel):
    # inserir sale
    payment_method = models.CharField(max_length=1, null=False, blank=False, choices=ChoiceOptions.PaymentMethodChoices.choices)
    payment_status = models.CharField(max_length=1, null=False, blank=False, choices=ChoiceOptions.PaymentStatusChoices.choices)
    paid_at = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2)
    
    class Meta:
        db_table = 'payment'
        managed = True
        
class Cart(BaseModel):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=False,
        related_name='carts',
        db_column='id_user'
    )
    
    is_open = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'cart'
        managed = True

class CartItem(BaseModel):
    cart = models.ForeignKey(
        to='Cart',
        on_delete=models.CASCADE,
        null=False,
        related_name='items',
        db_column='id_cart'
    )
    
    ticket = models.ForeignKey(
        to='Ticket',
        on_delete=models.PROTECT,
        null=False,
        db_column='id_ticket'
    )
    
class Sale(BaseModel):
    cart = models.OneToOneField(
        to='Cart',
        on_delete=models.PROTECT,
        null=False,
        db_column='id_cart'
    )
    
    payment = models.OneToOneField(
        to='Payment',
        on_delete=models.PROTECT,
        null=False,
        db_column='id_payment'
    )
    
    total_amount = models.DecimalField(null=False, decimal_places=2, max_digits=6)
    
class Ticket(BaseModel):
    trip_segment = models.ForeignKey(
        to='TripSegment',
        on_delete=models.PROTECT,
        null=False,
        related_name='tickets',
        db_column='id_trip_segment'
    )
    type_of_accommodation = models.CharField(max_length=1, null=False, blank=False, choices=ChoiceOptions.TypeOfAccommodationChoices.choices)
    main_passenger = models.ForeignKey(
        to='Passenger',
        on_delete=models.PROTECT,
        null=False,
        related_name='tickets',
        db_column='id_passenger'
    )
    price = models.DecimalField(null=False, decimal_places=2, max_digits=6)
    status = models.CharField(max_length=10, default='Reserved', choices=ChoiceOptions.TicketStatusChoices.choices)

    class Meta:
        db_table = 'ticket'
        managed = True
        
class AssociatedPassenger(BaseModel):
    ticket = models.ForeignKey(
        to='Ticket',
        on_delete=models.PROTECT,
        null=False,
        related_name='associated_passengers',
        db_column='id_ticket'
    )
    passenger = models.ForeignKey(
        to='Passenger',
        on_delete=models.PROTECT,
        null=False,
        db_column='id_passenger'
    )
    
    class Meta:
        db_table = 'associated_passenger'
        managed = True