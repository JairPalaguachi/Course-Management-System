from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Permite acceso solo a usuarios con role == 'admin'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )