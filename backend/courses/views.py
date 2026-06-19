from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SectionContent, Course
from .permissions import IsTutor
from .serializers import SectionContentUploadSerializer, TutorCourseCreateSerializer

from rest_framework import generics
from rest_framework.permissions import AllowAny 
from .models import SectionContent, Course, CourseSection, Category
from .serializers import CategorySerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] 

class TutorCourseCreateView(APIView):
    permission_classes = [IsAuthenticated, IsTutor]

    def post(self, request):
        serializer = TutorCourseCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        course = serializer.save()

        return Response(
            {
                'message': 'Curso creado exitosamente como borrador.',
                'course': {
                    'id': course.id,
                    'status': course.status,
                    'sections': [
                        {
                            'id': sec.id,
                            'name': sec.name,
                            'contents': [
                                {'id': c.id, 'type': c.type, 'label': c.label}
                                for c in sec.contents.all()
                            ],
                        }
                        for sec in course.sections.prefetch_related('contents').all()
                    ],
                },
            },
            status=status.HTTP_201_CREATED
        )


class SectionContentUploadView(APIView):
    """
    POST /api/tutor/contents/<content_id>/upload/

    Sube o reemplaza el archivo de un SectionContent.
    Solo el tutor dueño del curso puede operar sobre sus propios contenidos.
    """

    permission_classes = [IsAuthenticated, IsTutor]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, content_id):
        
        content = get_object_or_404(
            SectionContent,
            id=content_id,
            section__course__tutor=request.user,
        )

        
        if 'file' not in request.FILES:
            return Response(
                {"error": "No se ha proporcionado ningún archivo bajo la clave 'file'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        
        content.file = request.FILES['file']
        content.save()

        return Response(
            {
                "message": "Archivo subido exitosamente.",
                "content_id": content.id,
                "file_url": request.build_absolute_uri(content.file.url) if content.file else None,
            },
            status=status.HTTP_200_OK,
        )
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_course_cover(request, pk):
    try:
        
        course = Course.objects.get(pk=pk, tutor=request.user)
    except Course.DoesNotExist:
        return Response({'error': 'Curso no encontrado'}, status=404)

    if 'cover' not in request.FILES:
        return Response({'error': 'No se envió ninguna imagen'}, status=400)

   
    course.cover_image = request.FILES['cover']
    course.save()
    
    return Response({
        'message': 'Portada subida exitosamente', 
        'cover_url': course.cover_image.url
    })

class TutorCourseDetailView(APIView):
    """
    PUT /api/tutor/courses/<pk>/
    Actualiza un curso en borrador existente y añade nuevas secciones si se crearon.
    """
    permission_classes = [IsAuthenticated, IsTutor]

    def put(self, request, pk):
        
        course = get_object_or_404(Course, pk=pk, tutor=request.user)
        
        
        course.title = request.data.get('title', course.title)
        course.description = request.data.get('description', course.description)
        if request.data.get('category'):
            course.category_id = request.data.get('category')
        course.duration = request.data.get('duration', course.duration)
        course.level = request.data.get('level', course.level)
        course.objectives = request.data.get('objectives', course.objectives)
        course.preview_video = request.data.get('preview_video', course.preview_video)
        course.language = request.data.get('language', course.language)
        course.initial_content = request.data.get('initial_content', course.initial_content)
        course.save()

        
        sections_data = request.data.get('sections_meta', [])
        
        for sec_idx, sec_data in enumerate(sections_data):
            
            section, created = CourseSection.objects.get_or_create(
                course=course,
                name=sec_data.get('name', f'Sección {sec_idx+1}'),
                defaults={'order': sec_idx}
            )
            
            
            for idx, content_data in enumerate(sec_data.get('contents', [])):
                
                content, c_created = SectionContent.objects.get_or_create(
                    section=section,
                    type=content_data.get('type'),
                    label=content_data.get('label'),
                    defaults={'order': idx}
                )

       
        return Response({
            'message': 'Curso actualizado exitosamente.',
            'course': {
                'id': course.id,
                'status': course.status,
                'sections': [
                    {
                        'id': sec.id,
                        'name': sec.name,
                        'contents': [
                            {'id': c.id, 'type': c.type, 'label': c.label}
                            for c in sec.contents.all()
                        ],
                    }
                    for sec in course.sections.prefetch_related('contents').all()
                ],
            },
        }, status=status.HTTP_200_OK)