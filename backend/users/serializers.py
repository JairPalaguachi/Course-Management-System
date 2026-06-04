from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = ['id','email','nombre','apellido','full_name','role','bio','avatar','activo','created_at']
        read_only_fields = ['id','created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ['email','nombre','apellido','password','role']

    def validate_role(self, value):
        if value == 'admin':
            raise serializers.ValidationError("No puedes registrarte como administrador.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nombre','apellido','bio','avatar']
