from django.contrib import admin
from .models import City, Harbor

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "active")
    search_fields = ("name", "state")
    list_filter = ("state", "active")

@admin.register(Harbor)
class HarborAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "active")
    search_fields = ("name", "city__name")
    list_filter = ("city", "active")
