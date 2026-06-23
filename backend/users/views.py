<<<<<<< HEAD
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
=======
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

>>>>>>> 7e1d5f851c6096ea9930f882a02babab209c2f94
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

<<<<<<< HEAD
from .serializers import LoginSerializer, UserListSerializer
from .permissions import IsAdmin

User = get_user_model()


class LoginView(APIView):
    """
    POST /api/login/
    Permite iniciar sesión y retorna los tokens JWT del usuario.
    """

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
=======
from .serializers import (
    LoginSerializer,
    StudentRegisterSerializer,
    TutorRegisterSerializer,
)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )
>>>>>>> 7e1d5f851c6096ea9930f882a02babab209c2f94

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
<<<<<<< HEAD
                "role": user.role,
            },
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
=======
                "role": user.role
            }
        })


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
>>>>>>> 7e1d5f851c6096ea9930f882a02babab209c2f94
