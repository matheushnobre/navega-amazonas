import mercadopago
from django.conf import settings

sdk = mercadopago.SDK(settings.MERCADOPAGO_ACESS_TOKEN)

def generate_payment_link(departure_harbor, arrival_harbor, price):
    payment_data = {
        "items": [
            {
                "id": "1",
                "title": f"Passagem de {departure_harbor} para {arrival_harbor}",
                "quantity": 1,
                "unit_price": price,
                "currency_id": "BRL"
            }
        ],
        "back_urls": {
            "success": "http://localhost:4200/tickets",
            "pending": "http://localhost:4200/tickets",
            "failure": "http://localhost:4200/tickets"
        },
    }

    result = sdk.preference().create(payment_data)
    payment = result["response"]

    link = payment['init_point']
    return link