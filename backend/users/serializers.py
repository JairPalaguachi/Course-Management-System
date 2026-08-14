from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import serializers

from .models import User



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(
            username=attrs["username"],
            password=attrs["password"]
        )

        if not user:
            raise serializers.ValidationError(
                "Credenciales inválidas"
            )

        attrs["user"] = user
        return attrs


class UserListSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "nombre", "email", "role", "is_active"]

    def get_nombre(self, obj):
        return obj.get_full_name() or obj.username
    
class TutorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este correo electrónico."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este nombre de usuario."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Las contraseñas no coinciden."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        user = User(
            **validated_data,
            role=User.Role.TUTOR
        )

        user.set_password(password)
        user.save()

        return user


class StudentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este correo electrónico."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este nombre de usuario."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Las contraseñas no coinciden."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        user = User(
            **validated_data,
            role=User.Role.STUDENT
        )

        user.set_password(password)
        user.save()

        return user


class UserManageSerializer(serializers.ModelSerializer):
    """Serializer de lectura/edición para el panel de superusuario."""

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "is_active", "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class UserCreateSerializer(serializers.ModelSerializer):
    """Permite crear un usuario de cualquier rol desde el panel de superusuario."""

    password = serializers.CharField(write_only=True, min_length=8, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "is_active", "password", "password_confirm",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este correo electrónico.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class SetPasswordSerializer(serializers.Serializer):
    """Para que el superusuario cambie la contraseña de cualquier usuario."""

    new_password = serializers.CharField(write_only=True, min_length=8, required=True)
    new_password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Las contraseñas no coinciden."})
        return attrs