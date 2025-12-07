from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Ticket, Trip, TripStop, TripSegment

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
        
@receiver(pre_save, sender=Ticket, weak=False)
def pre_save_ticket(sender, instance, **kwargs):
    is_new = instance.pk is None
    trip_segment = instance.trip_segment

    # Atualizar preço ANTES de salvar o ticket
    if trip_segment:
        instance.price = trip_segment.individual_price

    # Se for criação, atualizar shipments e landings
    if is_new:
        from_stop = trip_segment.from_stop
        to_stop = trip_segment.to_stop

        from_stop.number_of_shipments += 1
        from_stop.save(update_fields=['number_of_shipments'])

        to_stop.number_of_landings += 1
        to_stop.save(update_fields=['number_of_landings'])
