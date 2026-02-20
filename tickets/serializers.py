from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for Ticket model"""

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    # -----------------------------
    # Field-level validation
    # -----------------------------
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title is required")
        if len(value) > 200:
            raise serializers.ValidationError("Title must be <= 200 characters")
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Description is required")
        return value

    # -----------------------------
    # Object-level validation
    # -----------------------------
    def validate(self, data):

        category_choices = [c[0] for c in Ticket._meta.get_field('category').choices]
        priority_choices = [p[0] for p in Ticket._meta.get_field('priority').choices]

        category = data.get('category')
        priority = data.get('priority')

        if category and category not in category_choices:
            raise serializers.ValidationError({
                "category": "Invalid category"
            })

        if priority and priority not in priority_choices:
            raise serializers.ValidationError({
                "priority": "Invalid priority"
            })

        return data
