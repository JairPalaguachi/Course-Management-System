from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from .serializers import RegisterSerializer, UserSerializer, UserUpdateSerializer
from .permissions import IsAdmin

class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['nombre'] = user.full_name
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT','PATCH']:
            return UserUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.role == 'admin':
            return Response({'error': 'Los administradores no pueden eliminar su cuenta aquí.'},
                            status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response({'message': 'Cuenta eliminada correctamente.'}, status=status.HTTP_204_NO_CONTENT)

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('-created_at')

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        return qs

class UserAdminUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
