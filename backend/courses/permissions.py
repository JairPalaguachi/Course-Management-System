from rest_framework.permissions import BasePermission


class IsTutor(BasePermission):
    """Permite acceso solo a usuarios con role == 'tutor'."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "tutor"
        )


class IsCourseOwner(BasePermission):
    """Permite acceso solo si el tutor autenticado es dueño del curso."""

    def has_object_permission(self, request, view, obj):
        return obj.tutor == request.user
