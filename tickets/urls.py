from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import TicketViewSet, ticket_stats, classify_ticket

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')


urlpatterns = [
    # custom URLs FIRST
    path('tickets/stats/', ticket_stats, name='ticket-stats'),
    path('tickets/classify/', classify_ticket, name='ticket-classify'),
]

# then router URLs
urlpatterns += router.urls
