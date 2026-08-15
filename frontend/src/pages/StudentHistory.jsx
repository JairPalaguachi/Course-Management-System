import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../context/useAuth";
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

function StudentHistory() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadEnrollments = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getStudentEnrollments();
                if (!active) return;
                setEnrollments(Array.isArray(data) ? data : []);
            } catch {
                if (!active) return;
                setEnrollments([]);
                setError("No se pudo cargar tu historial de cursos inscritos.");
            } finally {
                if (active) setLoading(false);
            }
        };

        loadEnrollments();
        return () => {
            active = false;
        };
    }, []);

    const firstName = useMemo(() => user?.first_name || user?.username || "Estudiante", [user]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    let content;

    if (loading) {
        content = (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress sx={{ color: TEAL }} />
                    <Typography sx={{ color: TEAL, fontWeight: 600 }}>
                        Cargando historial...
                    </Typography>
                </Stack>
            </Box>
        );
    } else if (enrollments.length === 0) {
        content = (
            <Card sx={{ borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ py: 8, textAlign: "center" }}>
                    <SchoolIcon sx={{ fontSize: 58, color: "#94a3b8", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ color: TEAL_MID, fontWeight: 700, mb: 1 }}>
                        No tienes inscripciones todavía
                    </Typography>
                    <Typography sx={{ color: "#64748b", mb: 3 }}>
                        Explora el catálogo y empieza tu primer curso.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/courses")}
                        sx={{
                            backgroundColor: TEAL,
                            textTransform: "none",
                            borderRadius: 3,
                            fontWeight: 700,
                            "&:hover": { backgroundColor: TEAL_MID },
                        }}
                    >
                        Ir al catálogo
                    </Button>
                </CardContent>
            </Card>
        );
    } else {
        content = (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 3,
                }}
            >
                {enrollments.map((enrollment) => {
                    const course = enrollment.course;
                    return (
                        <Card
                            key={enrollment.id}
                            sx={{
                                borderRadius: 4,
                                border: "1px solid #e2e8f0",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    height: 120,
                                    backgroundImage: course?.cover_image
                                        ? `url(${course.cover_image})`
                                        : `linear-gradient(145deg, ${TEAL_DARK}, ${TEAL})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {!course?.cover_image && (
                                    <SchoolIcon sx={{ fontSize: 44, color: "#ffffff", opacity: 0.85 }} />
                                )}
                            </Box>

                            <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 1.5 }}>
                                    <Chip
                                        label={enrollment.status || "active"}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#dcfce7",
                                            color: "#166534",
                                            fontWeight: 700,
                                            textTransform: "capitalize",
                                        }}
                                    />
                                </Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: TEAL_MID,
                                        fontWeight: 700,
                                        mb: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        minHeight: 56,
                                    }}
                                >
                                    {course?.title || "Curso sin título"}
                                </Typography>

                                <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 1.2 }}>
                                    Tutor: <strong style={{ color: "#334155" }}>{course?.tutor_name || "N/A"}</strong>
                                </Typography>

                                <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 2.2 }}>
                                    Inscrito el {formatEnrollmentDate(enrollment.enrolled_at)}
                                </Typography>

                                <Button
                                    component={RouterLink}
                                    to={`/student/courses/${course?.id}`}
                                    state={{ enrollment, from: location.pathname }}
                                    variant="outlined"
                                    startIcon={<VisibilityIcon />}
                                    sx={{
                                        mt: "auto",
                                        borderColor: TEAL,
                                        color: TEAL,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 3,
                                        "&:hover": { backgroundColor: "rgba(15,118,110,0.06)" },
                                    }}
                                >
                                    Ver detalle del curso
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: TEAL_LIGHT,
                width: "100vw",
                position: "relative",
                left: "50%",
                right: "50%",
                marginLeft: "-50vw",
                marginRight: "-50vw",
                overflowX: "hidden",
            }}
        >
            <Box
                sx={{
                    background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                    pt: { xs: 9, md: 11 },
                    pb: { xs: 6, md: 8 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Box>
                            <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 1 }}>
                                Hola, {firstName}
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#ffffff",
                                    fontWeight: 800,
                                    fontSize: { xs: "2rem", md: "2.6rem" },
                                }}
                            >
                                Historial de cursos inscritos
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.5}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate("/student/dashboard")}
                                sx={{
                                    color: "#ffffff",
                                    borderColor: "rgba(255,255,255,0.4)",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    "&:hover": {
                                        borderColor: "#ffffff",
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                    },
                                }}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="text"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{
                                    color: "rgba(255,255,255,0.8)",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                                }}
                            >
                                Cerrar sesión
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        {error}
                    </Alert>
                )}

                {content}
            </Container>
        </Box>
    );
}

export default StudentHistory;