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
    )

    # Arrival stop
    arrival_stop = TripStop.objects.create(
        trip=instance,
        harbor=instance.arrival_harbor,
        stop_datetime=instance.arrival_datetime,
    )     
    