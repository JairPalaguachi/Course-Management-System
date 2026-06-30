import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PropTypes from "prop-types";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Pagination,
    Stack,
    Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExploreIcon from "@mui/icons-material/Explore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchBar from "../components/SearchBar";
import BasicFilters from "../components/BasicFilters";
import CourseDetailDialog from "../components/CourseDetailDialog";
import api from "../services/api";

// ── Paleta (igual que AdminDashboard / TutorDashboard) ────────────────────────
const TEAL_DARK = "#0a2e2b";
const TEAL_MID = "#10423f";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

// ── Opciones de filtros (mismo esquema que Courses.jsx) ───────────────────────
const PAGE_SIZE = 9;

const LEVEL_OPTIONS = [
    { value: "", label: "Todos los niveles" },
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
];

const DURATION_OPTIONS = [
    { key: "all", label: "Cualquier duración", params: {} },
    { key: "short", label: "Hasta 4 horas", params: { max_duration: 240 } },
    { key: "medium", label: "4 a 8 horas", params: { min_duration: 240, max_duration: 480 } },
    { key: "long", label: "Más de 8 horas", params: { min_duration: 480 } },
];

const LEVEL_LABELS = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
};

const QUICK_LINKS = ["Mis cursos", "Catálogo", "Progreso", "Certificados", "Perfil"];

// ── Inscripciones de ejemplo (reemplazar con API real cuando esté lista) ──────
const MOCK_ENROLLMENTS = [
    {
        id: 1,
        progress: 72,
        course: {
            id: 1,
            title: "Introducción a Python para Ciencias de Datos",
            description: "Aprende los fundamentos de Python con enfoque en análisis de datos y visualización.",
            tutor_name: "Carlos Menéndez",
            cover_image: null,
        },
    },
    {
        id: 2,
        progress: 100,
        course: {
            id: 2,
            title: "Diseño UX/UI con Figma",
            description: "Crea interfaces modernas y accesibles usando las mejores herramientas del mercado.",
            tutor_name: "María Vásquez",
            cover_image: null,
        },
    },
    {
        id: 3,
        progress: 20,
        course: {
            id: 3,
            title: "Redes y Seguridad Informática",
            description: "Fundamentos de redes TCP/IP, protocolos de seguridad y buenas prácticas.",
            tutor_name: "Andrés Quiñónez",
            cover_image: null,
        },
    },
];

const CourseShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    tutor_name: PropTypes.string,
    cover_image: PropTypes.string,
    level: PropTypes.string,
});

const EnrollmentShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    progress: PropTypes.number,
    course: CourseShape,
});

const getPluralizedCourseText = (count, singular, plural) => {
    return count === 1 ? singular : plural;
};


// ── Tarjeta de curso inscrito ─────────────────────────────────────────────────
function EnrolledCourseCard({ enrollment, onGoToCourse }) {
    const course = enrollment.course ?? enrollment;
    const progress = enrollment.progress ?? 0;

    return (
        <Card
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e2e8f0",
                transition: "all 0.25s ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,118,110,0.15)",
                },
            }}
        >
            {/* Imagen / placeholder */}
            <Box
                sx={{
                    height: 140,
                    backgroundImage: course.cover_image
                        ? `url(${course.cover_image})`
                        : `linear-gradient(145deg, ${TEAL_DARK}, ${TEAL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {!course.cover_image && <SchoolIcon sx={{ fontSize: 52, color: "#fff", opacity: 0.85 }} />}

                {/* Barra de progreso sobre la imagen */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 5,
                        backgroundColor: "rgba(255,255,255,0.25)",
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            width: `${progress}%`,
                            backgroundColor: "#5eead4",
                            transition: "width 0.4s ease",
                        }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
                <Chip
                    label={`${progress}% completado`}
                    size="small"
                    icon={progress === 100 ? <CheckCircleIcon sx={{ fontSize: "14px !important" }} /> : undefined}
                    sx={{
                        backgroundColor: progress === 100 ? "#dcfce7" : "#dbeafe",
                        color: progress === 100 ? "#166534" : "#1d4ed8",
                        fontWeight: 700,
                        mb: 1.5,
                        alignSelf: "flex-start",
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: TEAL_DARK,
                        mb: 0.75,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 52,
                        fontSize: "0.95rem",
                    }}
                >
                    {course.title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.82rem",
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 38,
                    }}
                >
                    {course.description || "Sin descripción disponible."}
                </Typography>

                {course.tutor_name && (
                    <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8", mb: 2 }}>
                        Tutor: <strong style={{ color: "#475569" }}>{course.tutor_name}</strong>
                    </Typography>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => onGoToCourse(course.id)}
                    sx={{
                        mt: "auto",
                        backgroundColor: TEAL,
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 3,
                        "&:hover": { backgroundColor: TEAL_MID },
                    }}
                >
                    {progress === 100 ? "Repasar curso" : "Continuar"}
                </Button>
            </CardContent>
        </Card>
    );
}

EnrolledCourseCard.propTypes = {
    enrollment: EnrollmentShape.isRequired,
    onGoToCourse: PropTypes.func.isRequired,
};


// ── Tarjeta de catálogo (para inscribirse) ────────────────────────────────────
function CatalogCourseCard({ course, isEnrolled, onEnroll, onViewDetail }) {
    return (
        <Card
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e2e8f0",
                transition: "all 0.25s ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,118,110,0.15)",
                },
            }}
        >
            <Box
                sx={{
                    height: 140,
                    backgroundImage: course.cover_image
                        ? `url(${course.cover_image})`
                        : `linear-gradient(145deg, ${TEAL_DARK}, ${TEAL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {!course.cover_image && <AutoStoriesIcon sx={{ fontSize: 52, color: "#fff", opacity: 0.85 }} />}
            </Box>

            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
                {course.level && (
                    <Chip
                        label={LEVEL_LABELS[course.level] ?? course.level}
                        size="small"
                        sx={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            fontWeight: 600,
                            mb: 1.5,
                            alignSelf: "flex-start",
                            fontSize: "0.75rem",
                        }}
                    />
                )}

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: TEAL_DARK,
                        mb: 0.75,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 52,
                        fontSize: "0.95rem",
                    }}
                >
                    {course.title}
                </Typography>

                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.82rem",
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 38,
                    }}
                >
                    {course.description || "Sin descripción disponible."}
                </Typography>

                {course.tutor_name && (
                    <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8", mb: 2 }}>
                        Tutor: <strong style={{ color: "#475569" }}>{course.tutor_name}</strong>
                    </Typography>
                )}

                <Stack spacing={1} sx={{ mt: "auto" }}>
                    {isEnrolled ? (
                        <Button
                            fullWidth
                            variant="contained"
                            disabled
                            startIcon={<CheckCircleIcon />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 3,
                                backgroundColor: "#86efac",
                                color: "#166534",
                                "&.Mui-disabled": {
                                    backgroundColor: "#bbf7d0",
                                    color: "#166534",
                                },
                            }}
                        >
                            Ya inscrito
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => onEnroll(course)}
                            sx={{
                                backgroundColor: "#f59e0b",
                                color: "#1c1917",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 3,
                                "&:hover": { backgroundColor: "#d97706" },
                            }}
                        >
                            Inscribirme
                        </Button>
                    )}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => onViewDetail(course)}
                        sx={{
                            borderColor: TEAL,
                            color: TEAL,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 3,
                            "&:hover": { backgroundColor: "rgba(15,118,110,0.06)" },
                        }}
                    >
                        Ver detalle
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

CatalogCourseCard.propTypes = {
    course: CourseShape.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    onEnroll: PropTypes.func.isRequired,
    onViewDetail: PropTypes.func.isRequired,
};

// ── Componente principal ──────────────────────────────────────────────────────
function StudentDashboard() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // ── Estado: cursos inscritos (mock — reemplazar con llamada a API real) ──
    const [enrollments, setEnrollments] = useState(MOCK_ENROLLMENTS);
    const loadingEnrollments = false;
    const enrollmentsError = "";
    // ── IDs de cursos ya inscritos ───────────────────────────────────────────
    const enrolledIds = useMemo(
        () => new Set(enrollments.map((enrollment) => enrollment.course?.id ?? enrollment.id)),
        [enrollments]
    );

    // ── Estado: catálogo ─────────────────────────────────────────────────────
    const [catalogCourses, setCatalogCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");
    const [durationKey, setDurationKey] = useState("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [catalogError, setCatalogError] = useState("");

    const enrolledCoursesLabel = `${enrollments.length} ${getPluralizedCourseText(
        enrollments.length,
        "curso inscrito",
        "cursos inscritos"
    )}`;

    const availableCoursesLabel = `${totalCount} ${getPluralizedCourseText(
        totalCount,
        "curso disponible",
        "cursos disponibles"
    )}`;

    // ── Estado: inscripción y detalle ────────────────────────────────────────
    const [enrollingCourse, setEnrollingCourse] = useState(null);
    const [enrollSuccess, setEnrollSuccess] = useState("");
    const [enrollError, setEnrollError] = useState("");
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // ── Carga del catálogo ───────────────────────────────────────────────────
    useEffect(() => {
        let isActive = true;
        const loadCatalog = async () => {
            setLoadingCatalog(true);
            setCatalogError("");
            const durationFilters =
                DURATION_OPTIONS.find((o) => o.key === durationKey)?.params ?? {};
            const params = { page, page_size: PAGE_SIZE, ...durationFilters };
            if (search.trim()) params.search = search.trim();
            if (level) params.level = level;

            try {
                const response = await api.get("/courses/public/", { params });
                if (!isActive) return;
                const payload = response.data;
                const results = Array.isArray(payload) ? payload : payload?.results ?? [];
                const count = Array.isArray(payload) ? payload.length : payload?.count ?? results.length;
                setCatalogCourses(results);
                setTotalCount(count);
            } catch {
                if (!isActive) return;
                setCatalogError("No pudimos cargar el catálogo. Intenta nuevamente.");
                setCatalogCourses([]);
                setTotalCount(0);
            } finally {
                if (isActive) setLoadingCatalog(false);
            }
        };
        loadCatalog();
        return () => { isActive = false; };
    }, [durationKey, level, page, search]);



    // ── Confirmar inscripción (mock — reemplazar con POST /enrollments/) ─────
    const handleConfirmEnroll = async () => {
        if (!enrollingCourse) return;
        setEnrollLoading(true);
        setEnrollError("");
        // Simular pequeño delay de red
        await new Promise((res) => setTimeout(res, 600));
        setEnrollments((prev) => [
            ...prev,
            {
                id: Date.now(),
                progress: 0,
                course: enrollingCourse,
            },
        ]);
        setEnrollSuccess(`Inscrito a "${enrollingCourse.title}" exitosamente.`);
        setEnrollingCourse(null);
        setEnrollLoading(false);
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const firstName = user?.first_name || user?.username || "Estudiante";

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
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <Box
                sx={{
                    background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 12 },
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                }}
            >
                {/* Círculos decorativos */}
                <Box sx={{
                    position: "absolute", top: -80, right: -80,
                    width: 400, height: 400, borderRadius: "50%",
                    background: "rgba(15,118,110,0.18)", pointerEvents: "none",
                }} />
                <Box sx={{
                    position: "absolute", bottom: -60, left: -60,
                    width: 280, height: 280, borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)", pointerEvents: "none",
                }} />

                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    {/* Botón cerrar sesión */}
                    <Box sx={{ position: "absolute", top: 0, right: 16 }}>
                        <Button
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                color: "rgba(255,255,255,0.7)",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                py: 0.8,
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    color: "#ffffff",
                                },
                            }}
                        >
                            Cerrar sesión
                        </Button>
                    </Box>

                    {/* Ícono de marca */}
                    <Box sx={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 72, height: 72, borderRadius: "20px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        mb: 3,
                    }}>
                        <MenuBookIcon sx={{ fontSize: 38, color: "#fff" }} />
                    </Box>

                    <Typography
                        variant="overline"
                        sx={{
                            display: "block",
                            color: "rgba(255,255,255,0.6)",
                            letterSpacing: 4,
                            mb: 1.5,
                            fontSize: "1.2rem",
                        }}
                    >
                        BIENVENIDO, {firstName.toUpperCase()}
                    </Typography>

                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.4rem" },
                            lineHeight: 1.1,
                            color: "#ffffff",
                            mb: 2,
                            letterSpacing: "-1px",
                        }}
                    >
                        Tu espacio de
                        <Box component="span" sx={{ display: "block", color: "#5eead4" }}>
                            Aprendizaje
                        </Box>
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255,255,255,0.72)",
                            fontWeight: 400,
                            maxWidth: 520,
                            mx: "auto",
                            mb: 5,
                            lineHeight: 1.65,
                            fontSize: { xs: "1rem", md: "1.15rem" },
                        }}
                    >
                        Retoma tus cursos, descubre nuevos contenidos e inscríbete en lo que
                        quieras aprender hoy.
                    </Typography>

                    {/* Botones CTA */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "center", alignItems: "center", maxWidth: 500, mx: "auto" }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayCircleOutlineIcon />}
                            onClick={() => {
                                document.getElementById("enrolled-courses-section")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            sx={{
                                px: 4, py: 1.6,
                                borderRadius: 3,
                                fontSize: "1rem",
                                fontWeight: 700,
                                backgroundColor: "#f59e0b",
                                color: "#1c1917",
                                boxShadow: "0 4px 24px rgba(245,158,11,0.35)",
                                "&:hover": {
                                    backgroundColor: "#d97706",
                                    boxShadow: "0 6px 28px rgba(245,158,11,0.45)",
                                },
                                textTransform: "none",
                                minWidth: 220,
                            }}
                        >
                            Mis Cursos
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ExploreIcon />}
                            onClick={() => {
                                document.getElementById("catalog-section")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            sx={{
                                px: 4, py: 1.6,
                                borderRadius: 3,
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#ffffff",
                                borderColor: "rgba(255,255,255,0.45)",
                                "&:hover": {
                                    borderColor: "#ffffff",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                },
                                textTransform: "none",
                                minWidth: 220,
                            }}
                        >
                            Explorar Catálogo
                        </Button>
                    </Stack>

                    {/* Chips de acceso rápido */}
                    <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                        {QUICK_LINKS.map((label) => (
                            <Chip
                                key={label}
                                label={label}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.78)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    fontSize: "0.78rem",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.18)",
                                        cursor: "pointer",
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── Tarjetas de resumen ───────────────────────────────────────── */}
            <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 700, color: TEAL_MID, mb: 1 }}
                >
                    Tu actividad en la plataforma
                </Typography>
                <Typography align="center" sx={{ color: "#64748b", mb: 6, maxWidth: 480, mx: "auto" }}>
                    Un vistazo rápido a tu progreso, tus cursos activos y tus logros recientes.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
                    {[
                        {
                            icon: <MenuBookIcon sx={{ fontSize: 32, color: TEAL }} />,
                            title: "Cursos Activos",
                            desc: "Retoma donde lo dejaste y avanza a tu propio ritmo sin presiones.",
                        },
                        {
                            icon: <TrendingUpIcon sx={{ fontSize: 32, color: TEAL }} />,
                            title: "Progreso Continuo",
                            desc: "Cada sección completada te acerca más a dominar el tema.",
                        },
                        {
                            icon: <EmojiEventsIcon sx={{ fontSize: 32, color: TEAL }} />,
                            title: "Certificaciones",
                            desc: "Al completar un curso obtienes un certificado de logro.",
                        },
                    ].map(({ icon, title, desc }) => (
                        <Box
                            key={title}
                            sx={{
                                flex: 1,
                                backgroundColor: "#ffffff",
                                borderRadius: 4,
                                border: "1px solid #e2e8f0",
                                p: 3.5,
                                textAlign: "center",
                                transition: "box-shadow 0.2s, transform 0.2s",
                                "&:hover": {
                                    boxShadow: "0 8px 32px rgba(15,118,110,0.12)",
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <Box sx={{ mb: 2 }}>{icon}</Box>
                            <Typography sx={{ fontWeight: 700, color: TEAL_MID, mb: 1 }}>{title}</Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                {desc}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Container>

            {/* ── Cursos inscritos ──────────────────────────────────────────── */}
            <Box
                id="enrolled-courses-section"
                sx={{ backgroundColor: "#ffffff", py: { xs: 7, md: 10 }, width: "100%" }}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 5 }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: TEAL_MID, mb: 0.5 }}>
                                Mis Cursos
                            </Typography>
                            <Typography sx={{ color: "#64748b" }}>
                                {loadingEnrollments ? "Cargando..." : enrolledCoursesLabel}
                            </Typography>
                        </Box>

                        <Chip
                            icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
                            label={loadingEnrollments ? "..." : `${enrollments.length} activos`}
                            sx={{
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                px: 1,
                            }}
                        />
                    </Stack>

                    {enrollSuccess && (
                        <Alert
                            severity="success"
                            onClose={() => setEnrollSuccess("")}
                            sx={{ mb: 3, borderRadius: 3 }}
                        >
                            {enrollSuccess}
                        </Alert>
                    )}

                    {enrollmentsError && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                            {enrollmentsError}
                        </Alert>
                    )}

                    {loadingEnrollments ? (
                        <Box sx={{ display: "grid", placeItems: "center", minHeight: 200 }}>
                            <Stack alignItems="center" spacing={2}>
                                <CircularProgress sx={{ color: TEAL }} />
                                <Typography sx={{ color: TEAL, fontWeight: 600 }}>
                                    Cargando tus cursos...
                                </Typography>
                            </Stack>
                        </Box>
                    ) : enrollments.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 10 }}>
                            <MenuBookIcon sx={{ fontSize: 64, color: "#94a3b8", mb: 2 }} />
                            <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                                Aún no estás inscrito en ningún curso.
                            </Typography>
                            <Typography sx={{ color: "#94a3b8", mb: 3 }}>
                                Explora el catálogo y empieza a aprender hoy.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<ExploreIcon />}
                                onClick={() =>
                                    document.getElementById("catalog-section")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                sx={{
                                    backgroundColor: TEAL,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    "&:hover": { backgroundColor: TEAL_MID },
                                }}
                            >
                                Explorar catálogo
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                },
                                gap: 3,
                                alignItems: "stretch",
                            }}
                        >
                            {enrollments.map((enrollment) => {
                                const id = enrollment.course?.id ?? enrollment.id;
                                return (
                                    <EnrolledCourseCard
                                        key={id}
                                        enrollment={enrollment}
                                        onGoToCourse={(courseId) =>
                                            navigate(`/student/courses/${courseId}`)
                                        }
                                    />
                                );
                            })}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* ── Catálogo de cursos ────────────────────────────────────────── */}
            <Box
                id="catalog-section"
                sx={{ backgroundColor: TEAL_LIGHT, py: { xs: 7, md: 10 }, width: "100%" }}
            >
                <Container maxWidth="lg">
                    {/* Encabezado */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 4 }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: TEAL_MID, mb: 0.5 }}>
                                Catálogo de Cursos
                            </Typography>
                            <Typography sx={{ color: "#64748b" }}>
                                {loadingCatalog ? "Buscando..." : `${totalCount} curso${totalCount !== 1 ? "s" : ""} disponible${totalCount !== 1 ? "s" : ""}`}
                            </Typography>
                        </Box>
                        <Chip
                            icon={<ExploreIcon sx={{ fontSize: 16 }} />}
                            label="Catálogo público"
                            sx={{
                                backgroundColor: "rgba(15,118,110,0.1)",
                                color: TEAL_MID,
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                px: 1,
                                border: `1px solid ${TEAL}33`,
                            }}
                        />
                    </Stack>

                    {/* Filtros */}
                    <Box
                        sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 4,
                            border: "1px solid #e2e8f0",
                            p: { xs: 2, md: 3 },
                            mb: 4,
                        }}
                    >
                        <Stack spacing={2}>
                            <SearchBar
                                value={search}
                                label="Buscar cursos"
                                placeholder="Ej. programación, marketing, matemáticas..."
                                onChange={(v) => { setSearch(v); setPage(1); }}
                                onClear={() => { setSearch(""); setPage(1); }}
                            />
                            <BasicFilters
                                level={level}
                                durationKey={durationKey}
                                levelOptions={LEVEL_OPTIONS}
                                durationOptions={DURATION_OPTIONS}
                                onLevelChange={(v) => { setLevel(v); setPage(1); }}
                                onDurationChange={(v) => { setDurationKey(v); setPage(1); }}
                                onReset={() => {
                                    setSearch(""); setLevel(""); setDurationKey("all"); setPage(1);
                                }}
                            />
                            <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                                {loadingCatalog ? "Buscando..." : availableCoursesLabel}
                            </Typography>
                        </Stack>
                    </Box>

                    {catalogError && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                            {catalogError}
                        </Alert>
                    )}

                    {/* Contenido del catálogo */}
                    {loadingCatalog ? (
                        <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
                            <Stack alignItems="center" spacing={2}>
                                <CircularProgress sx={{ color: TEAL }} />
                                <Typography sx={{ color: TEAL, fontWeight: 600 }}>
                                    Cargando cursos publicados...
                                </Typography>
                            </Stack>
                        </Box>
                    ) : catalogCourses.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <AutoStoriesIcon sx={{ fontSize: 64, color: "#94a3b8", mb: 2 }} />
                            <Typography variant="h6" sx={{ color: "#64748b" }}>
                                No encontramos cursos para estos filtros.
                            </Typography>
                            <Typography sx={{ color: "#94a3b8", mt: 0.5 }}>
                                Prueba cambiando el texto de búsqueda, el nivel o la duración.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={4} sx={{ mb: 4 }}>
                                {catalogCourses.map((course) => (
                                    <Grid xs={12} sm={6} md={4} lg={3} key={course.id}>
                                        <CatalogCourseCard
                                            course={course}
                                            isEnrolled={enrolledIds.has(course.id)}
                                            onEnroll={setEnrollingCourse}
                                            onViewDetail={setSelectedCourse}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {totalPages > 1 && (
                                <Stack alignItems="center">
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, v) => setPage(v)}
                                        color="primary"
                                        size="large"
                                    />
                                </Stack>
                            )}
                        </>
                    )}
                </Container>
            </Box>

            {/* ── Banner CTA ────────────────────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: TEAL_MID,
                    py: { xs: 7, md: 9 },
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <Container maxWidth="sm">
                    <EmojiEventsIcon sx={{ fontSize: 52, color: "#5eead4", mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 1.5 }}>
                        ¿Listo para seguir aprendiendo?
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}>
                        Explora el catálogo completo e inscríbete en cursos nuevos para
                        seguir creciendo cada día.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<ExploreIcon />}
                        onClick={() =>
                            document.getElementById("catalog-section")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        sx={{
                            px: 4, py: 1.5,
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: "none",
                            backgroundColor: "#f59e0b",
                            color: "#1c1917",
                            "&:hover": { backgroundColor: "#d97706" },
                        }}
                    >
                        Explorar catálogo
                    </Button>
                </Container>
            </Box>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <Box sx={{ backgroundColor: TEAL_DARK, py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>

            {/* ── Dialog: confirmar inscripción ─────────────────────────────── */}
            <Dialog
                open={Boolean(enrollingCourse)}
                onClose={() => { setEnrollingCourse(null); setEnrollError(""); }}
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, color: TEAL_DARK }}>
                    Confirmar inscripción
                </DialogTitle>
                <DialogContent>
                    {enrollError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {enrollError}
                        </Alert>
                    )}
                    <Typography sx={{ color: "#475569" }}>
                        ¿Deseas inscribirte en{" "}
                        <strong style={{ color: TEAL_DARK }}>{enrollingCourse?.title}</strong>?
                    </Typography>
                    {enrollingCourse?.tutor_name && (
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem", mt: 1 }}>
                            Tutor: {enrollingCourse.tutor_name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={() => { setEnrollingCourse(null); setEnrollError(""); }}
                        sx={{ textTransform: "none", color: "#64748b" }}
                        disabled={enrollLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmEnroll}
                        disabled={enrollLoading}
                        startIcon={enrollLoading ? <CircularProgress size={16} color="inherit" /> : <AddCircleOutlineIcon />}
                        sx={{
                            backgroundColor: "#f59e0b",
                            color: "#1c1917",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 3,
                            "&:hover": { backgroundColor: "#d97706" },
                        }}
                    >
                        {enrollLoading ? "Inscribiendo..." : "Inscribirme"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: detalle de curso ──────────────────────────────────── */}
            <CourseDetailDialog
                open={Boolean(selectedCourse)}
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
            />
        </Box>
    );
}

export default StudentDashboard;