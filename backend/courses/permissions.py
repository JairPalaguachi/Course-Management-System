from rest_framework.permissions import BasePermission


class IsTutor(BasePermission):
    message = "Solo los tutores pueden realizar esta acción."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "tutor"
        )