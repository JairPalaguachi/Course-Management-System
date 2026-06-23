from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


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