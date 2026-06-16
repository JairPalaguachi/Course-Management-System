from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from .serializers import UserListSerializer
from .permissions import IsAdmin

User = get_user_model()


class UserListView(generics.ListAPIView):
    """
    GET /api/users/
    Solo accesible por administradores.
    Permite filtrar por rol: ?role=estudiante | tutor | administrador
    Retorna: id, nombre, email, role, is_active
    """
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = User.objects.all().order_by("id")
        role = self.request.query_params.get("role")
        if role:
            queryset = queryset.filter(role=role)
        return queryset
