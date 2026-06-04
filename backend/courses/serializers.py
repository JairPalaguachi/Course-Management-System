from rest_framework import serializers
from .models import Course, Material, Enrollment, Category
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'nombre', 'descripcion']

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id','titulo','tipo','archivo','url','orden','created_at']
        read_only_fields = ['id','created_at']

class CourseSerializer(serializers.ModelSerializer):
    tutor_info = UserSerializer(source='tutor', read_only=True)
    categorias_info = CategorySerializer(source='categorias', many=True, read_only=True)
    materiales = MaterialSerializer(many=True, read_only=True)
    total_inscritos = serializers.ReadOnlyField()
    categorias = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), required=False)

    class Meta:
        model = Course
        fields = ['id','titulo','descripcion','imagen','tutor','tutor_info','categorias',
                  'categorias_info','estado','nivel','duracion_horas','materiales',
                  'total_inscritos','aprobado_por','fecha_aprobacion','created_at','updated_at']
        read_only_fields = ['id','tutor','estado','aprobado_por','fecha_aprobacion','created_at','updated_at']

class CourseCreateSerializer(serializers.ModelSerializer):
    categorias = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), required=False)
    class Meta:
        model = Course
        fields = ['titulo','descripcion','imagen','categorias','nivel','duracion_horas']

    def create(self, validated_data):
        categorias = validated_data.pop('categorias', [])
        course = Course.objects.create(**validated_data)
        course.categorias.set(categorias)
        return course

class EnrollmentSerializer(serializers.ModelSerializer):
    curso_info = CourseSerializer(source='curso', read_only=True)
    class Meta:
        model = Enrollment
        fields = ['id','curso','curso_info','estado','fecha_inscripcion','fecha_completado']
        read_only_fields = ['id','estado','fecha_inscripcion','fecha_completado']
