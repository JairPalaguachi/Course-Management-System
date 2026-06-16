from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserListSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "nombre", "email", "role", "is_active"]

    def get_nombre(self, obj):
        return obj.get_full_name() or obj.username
