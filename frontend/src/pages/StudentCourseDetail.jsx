import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { getStudentEnrollments } from "../services/enrollmentService";

const TEAL_DARK = "#0a2e2b";
const TEAL_MID = "#10423f";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

const formatEnrollmentDate = (isoDate) => {
    if (!isoDate) return "Fecha no disponible";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

function StudentCourseDetail() {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState(location.state?.enrollment || null);
    const [loading, setLoading] = useState(!location.state?.enrollment);
    const [error, setError] = useState("");
    const fallbackPath = location.state?.from || "/student/dashboard";

    useEffect(() => {
        if (enrollment) return;

        let active = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getStudentEnrollments();
                if (!active) return;
                const match = (Array.isArray(data) ? data : []).find(
                    (item) => String(item?.course?.id) === String(courseId)
                );
                if (!match) {
                    setError("No encontramos este curso en tu historial de inscripciones.");
                    setEnrollment(null);
                } else {
                    setEnrollment(match);
                }
            } catch {
                if (!active) return;
                setError("No se pudo cargar el detalle del curso.");
                setEnrollment(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [courseId, enrollment]);

    const course = useMemo(() => enrollment?.course || null, [enrollment]);

    let content;

    if (loading) {
        content = (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress sx={{ color: TEAL }} />
                    <Typography sx={{ color: TEAL, fontWeight: 600 }}>
                        Cargando detalle...
                    </Typography>
                </Stack>
            </Box>
        );
    } else if (error) {
        content = (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
                {error}
            </Alert>
        );
    } else {
        content = (
            <Card sx={{ borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <Box
                    sx={{
                        height: 220,
                        backgroundImage: course?.cover_image
                            ? `url(${course.cover_image})`
                            : `linear-gradient(145deg, ${TEAL_DARK}, ${TEAL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    {!course?.cover_image && (
                        <SchoolIcon sx={{ fontSize: 76, color: "#ffffff", opacity: 0.9 }} />
                    )}
                </Box>

                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                        <Chip
                            label={enrollment?.status || "active"}
                            sx={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                                fontWeight: 700,
                                textTransform: "capitalize",
                            }}
                        />
                        {course?.level && (
                            <Chip
                                label={course.level}
                                sx={{ backgroundColor: "#e0f2fe", color: "#075985", fontWeight: 700 }}
                            />
                        )}
                    </Stack>

                    <Typography variant="h4" sx={{ color: TEAL_MID, fontWeight: 800, mb: 1 }}>
                        {course?.title || "Curso"}
                    </Typography>

                    <Typography sx={{ color: "#64748b", mb: 2, lineHeight: 1.7 }}>
                        {course?.description || "Sin descripción disponible."}
                    </Typography>

                    <Typography sx={{ color: "#334155", mb: 1 }}>
                        Tutor: <strong>{course?.tutor_name || "N/A"}</strong>
                    </Typography>
                    <Typography sx={{ color: "#334155" }}>
                        Fecha de inscripción: <strong>{formatEnrollmentDate(enrollment?.enrolled_at)}</strong>
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: TEAL_LIGHT }}>
            <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(fallbackPath)}
                    sx={{
                        mb: 3,
                        color: TEAL,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: "rgba(15,118,110,0.08)" },
                    }}
                >
                    Volver
                </Button>

                {content}
            </Container>
        </Box>
    );
}

export default StudentCourseDetail;