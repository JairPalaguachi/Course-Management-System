from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, ProfileView, DeleteAccountView, UserListView, UserAdminUpdateView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/delete/', DeleteAccountView.as_view(), name='delete_account'),
    path('admin/users/', UserListView.as_view(), name='user_list'),
    path('admin/users/<int:pk>/', UserAdminUpdateView.as_view(), name='user_update'),
]
