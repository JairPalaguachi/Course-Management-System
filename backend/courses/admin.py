from django.contrib import admin
from .models import Category, Course


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'tutor',
        'category',
        'status',
        'is_active',
        'created_at',
    )
    list_filter = ('status', 'category', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'tutor__username')
    readonly_fields = ('created_at', 'updated_at')