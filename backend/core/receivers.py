from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Trip, TripStop, TripSegment

@receiver(post_save, sender=Trip, weak=False)
def create_trip_stops_on_trip_created(sender, instance, created, **kwargs):
    if not created:
        return

    # Departure stop
    departure_stop = TripStop.objects.create(
        trip=instance,
        harbor=instance.departure_harbor,
        stop_datetime=instance.departure_datetime,
        is_departure_stop=True
    )

    # Arrival stop
    arrival_stop = TripStop.objects.create(
        trip=instance,
        harbor=instance.arrival_harbor,
        stop_datetime=instance.arrival_datetime,
        is_arrival_stop=True
    )     
    

@receiver(post_save, sender=TripStop, weak=False)
def create_trip_segments_after_insert_trip_stop(sender, instance, created, **kwargs):
    if not created:
        return

    trip = instance.trip 
    stops = list(trip.trip_stops.order_by('stop_datetime'))
    idx = stops.index(instance)
    
    for i, stop in enumerate(stops):
        if i == idx: continue
        trip_segment = TripSegment.objects.create(
            trip = trip,
            from_stop = stop if i < idx else instance,
            to_stop = instance if i < idx else stop,
            individual_price = instance.trip.individual_base_price        
        )
        
        trip_segment.calculate_price()