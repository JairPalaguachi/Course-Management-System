from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "ok",
        "message": "Course Management System API is running",
    })


def react_app(request):
    index_path = (
        Path(settings.BASE_DIR).parent
        / "frontend"
        / "dist"
        / "index.html"
    )

    if index_path.exists():
        return FileResponse(open(index_path, "rb"))

    raise Http404("React build not found. Run npm run build inside frontend.")