import os
import json
from datetime import timedelta

from django.utils.timezone import now
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate

from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from .models import Ticket
from .serializers import TicketSerializer


# -------------------------------
# Ticket CRUD
# -------------------------------

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']


# -------------------------------
# Stats API (DB-level aggregation)
# -------------------------------

@api_view(['GET'])
def ticket_stats(request):

    total_tickets = Ticket.objects.count()
    open_tickets = Ticket.objects.filter(status='open').count()

    last_30_days = now() - timedelta(days=30)

    daily_data = (
        Ticket.objects
        .filter(created_at__gte=last_30_days)
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(count=Count('id'))
    )

    avg_tickets = daily_data.aggregate(avg=Avg('count'))['avg'] or 0

    priority_data = Ticket.objects.values('priority').annotate(count=Count('id'))
    category_data = Ticket.objects.values('category').annotate(count=Count('id'))

    priority_breakdown = {item['priority']: item['count'] for item in priority_data}
    category_breakdown = {item['category']: item['count'] for item in category_data}

    return Response({
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "avg_tickets_per_day": round(avg_tickets, 2),
        "priority_breakdown": priority_breakdown,
        "category_breakdown": category_breakdown,
    }, status=status.HTTP_200_OK)


# -------------------------------
# LLM Classification API
# -------------------------------

# Try to import OpenAI safely
try:
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key) if api_key else None
except Exception:
    client = None


@api_view(['POST'])
def classify_ticket(request):

    description = request.data.get('description')

    if not description:
        return Response(
            {"error": "Description is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Fallback if OpenAI not available
    if client is None:
        return Response({
            "suggested_category": "general",
            "suggested_priority": "medium",
        }, status=status.HTTP_200_OK)

    prompt = f"""
Classify the following support ticket.

Categories: billing, technical, account, general
Priorities: low, medium, high, critical

Return ONLY valid JSON:
{{"category": "...", "priority": "..."}}

Description: {description}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        return Response({
            "suggested_category": data.get("category"),
            "suggested_priority": data.get("priority"),
        }, status=status.HTTP_200_OK)

    except Exception:
        # fallback on error
        return Response({
            "suggested_category": "general",
            "suggested_priority": "medium",
        }, status=status.HTTP_200_OK)
