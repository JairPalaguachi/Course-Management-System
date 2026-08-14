from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .permissions import IsStaffUser
from .serializers import UserManageSerializer, UserCreateSerializer, SetPasswordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .permissions import IsAdmin

from .serializers import (
    LoginSerializer,
    StudentRegisterSerializer,
    TutorRegisterSerializer,
    UserListSerializer,
    
)

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "is_staff": user.is_staff, 
            }
        })


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

class StudentRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentRegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        return Response(
            {
                "message": "Estudiante registrado exitosamente.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role
                }
            },
            status=status.HTTP_201_CREATED
        )


class TutorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TutorRegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        return Response(
            {
                "message": "Tutor registrado exitosamente.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role
                }
            },
            status=status.HTTP_201_CREATED
        )

class SuperUserUserListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/superuser/users/   → listar todos los usuarios (cualquier rol)
    POST /api/superuser/users/   → crear un usuario de cualquier rol
    """
    permission_classes = [IsAuthenticated, IsStaffUser]

    def get_queryset(self):
        queryset = User.objects.all().order_by("id")
        role = self.request.query_params.get("role")
        search = self.request.query_params.get("search")
        if role:
            queryset = queryset.filter(role=role)
        if search:
            queryset = queryset.filter(Q(username__icontains=search) | Q(email__icontains=search))
        return queryset

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == "POST" else UserManageSerializer


class SuperUserUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/superuser/users/{id}/
    PUT    /api/superuser/users/{id}/
    PATCH  /api/superuser/users/{id}/
    DELETE /api/superuser/users/{id}/
    """
    queryset = User.objects.all()
    serializer_class = UserManageSerializer
    permission_classes = [IsAuthenticated, IsStaffUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response({"detail": "No puedes eliminar tu propia cuenta."}, status=status.HTTP_400_BAD_REQUEST)
        if instance.is_superuser:
            return Response({"detail": "No puedes eliminar una cuenta de superusuario desde este panel."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)


class SuperUserSetPasswordView(APIView):
    """POST /api/superuser/users/{id}/set-password/"""
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Contraseña actualizada exitosamente."})