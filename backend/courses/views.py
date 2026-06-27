from django.db.models import Q
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import Course
from .pagination import CourseCatalogPagination
from .serializers import PublicCourseSerializer


class PublicCourseListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicCourseSerializer
    pagination_class = CourseCatalogPagination

    def get_queryset(self):
        queryset = (
            Course.objects.filter(status=Course.Status.PUBLISHED)
            .select_related('category', 'tutor')
            .order_by('-published_at', '-created_at')
        )
		
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
		
        # filter by category name or id
        category = self.request.query_params.get('category', None)
        if category:
            if category.isdigit():
                queryset = queryset.filter(category__id=int(category))
            else:
                queryset = queryset.filter(category__name__iexact=category)
		
        # filter by level
        level = self.request.query_params.get('level', None)
        if level:
            queryset = queryset.filter(level__iexact=level)
		
        # filter by duration range (minutes)
        min_dur = self.request.query_params.get('min_duration', None)
        max_dur = self.request.query_params.get('max_duration', None)
        if min_dur and min_dur.isdigit():
            queryset = queryset.filter(duration_minutes__gte=int(min_dur))
        if max_dur and max_dur.isdigit():
            queryset = queryset.filter(duration_minutes__lte=int(max_dur))
		
        return queryset
