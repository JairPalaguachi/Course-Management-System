from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """Permite acceso solo a usuarios con role == 'student'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "student"
        )