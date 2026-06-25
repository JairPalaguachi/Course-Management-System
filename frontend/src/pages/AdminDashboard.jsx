import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Chip,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BarChartIcon from "@mui/icons-material/BarChart";
import GavelIcon from "@mui/icons-material/Gavel";
import LogoutIcon from "@mui/icons-material/Logout";

// ── Paleta (igual que TutorDashboard / TutorCourses) ──────────────────────────
const TEAL_DARK  = "#0a2e2b";
const TEAL_MID   = "#10423f";
const TEAL       = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

// ── Datos de ejemplo — reemplaza con tu servicio real ─────────────────────────
const MOCK_PENDING_COURSES = [
    {
        id: 1,
        title: "Introducción a Python para Ciencias de Datos",
        description: "Aprende los fundamentos de Python con enfoque en análisis de datos y visualización.",
        tutor: "Carlos Menéndez",
        submitted_at: "2025-06-18",
        cover_image: null,
    },
    {
        id: 2,
        title: "Diseño UX/UI con Figma",
        description: "Crea interfaces modernas y accesibles usando las mejores herramientas del mercado.",
        tutor: "María Vásquez",
        submitted_at: "2025-06-20",
        cover_image: null,
    },
    {
        id: 3,
        title: "Redes y Seguridad Informática",
        description: "Fundamentos de redes TCP/IP, protocolos de seguridad y buenas prácticas.",
        tutor: "Andrés Quiñónez",
        submitted_at: "2025-06-21",
        cover_image: null,
    },
    {
        id: 4,
        title: "Álgebra Lineal Aplicada",
        description: "Vectores, matrices y transformaciones lineales con aplicaciones en ingeniería.",
        tutor: "Luisa Paredes",
        submitted_at: "2025-06-22",
        cover_image: null,
    },
];

const ADMIN_FEATURES = [
    {
        icon: <HourglassEmptyIcon sx={{ fontSize: 32, color: TEAL }} />,
        title: "Cursos Pendientes",
        desc: "Revisa los cursos enviados por tutores que esperan tu aprobación antes de publicarse.",
    },
    {
        icon: <PeopleAltIcon sx={{ fontSize: 32, color: TEAL }} />,
        title: "Gestión de Usuarios",
        desc: "Administra tutores y estudiantes: activa, suspende o edita sus cuentas desde un solo lugar.",
    },
    {
        icon: <BarChartIcon sx={{ fontSize: 32, color: TEAL }} />,
        title: "Estadísticas Globales",
        desc: "Monitorea el rendimiento de la plataforma, inscripciones y actividad de contenido.",
    },
];

const QUICK_LINKS = [
    "Cursos Pendientes", "Usuarios", "Tutores", "Estadísticas", "Reportes", "Configuración",
];

// ─────────────────────────────────────────────────────────────────────────────

function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const [pendingCourses, setPendingCourses] = useState(MOCK_PENDING_COURSES);

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
                            onClick= {handleLogout}
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
                        <AdminPanelSettingsIcon sx={{ fontSize: 38, color: "#fff" }} />
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
                        BIENVENIDO, ADMINISTRADOR
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
                        Panel de
                        <Box component="span" sx={{ display: "block", color: "#5eead4" }}>
                            Administración
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
                        Revisa y aprueba cursos, gestiona usuarios y monitorea el rendimiento
                        de la plataforma desde un solo lugar.
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
                            startIcon={<GavelIcon />}
                            onClick={() => {
                                const section = document.getElementById("pending-courses-section");
                                if (section) section.scrollIntoView({ behavior: "smooth" });
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
                            Revisar Cursos Pendientes
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<PeopleAltIcon />}
                            onClick={() => navigate("/admin/users")}
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
                            Gestionar Usuarios
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
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.18)", cursor: "pointer" },
                                }}
                            />
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── Tarjetas de funcionalidades ───────────────────────────────── */}
            <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 700, color: TEAL_MID, mb: 1 }}
                >
                    Herramientas administrativas
                </Typography>
                <Typography align="center" sx={{ color: "#64748b", mb: 6, maxWidth: 480, mx: "auto" }}>
                    Todo lo que necesitas para mantener la plataforma organizada, segura y en constante crecimiento.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
                    {ADMIN_FEATURES.map(({ icon, title, desc }) => (
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

            {/* ── Listado de cursos pendientes ──────────────────────────────── */}
            <Box
                id="pending-courses-section"
                sx={{ backgroundColor: "#ffffff", py: { xs: 7, md: 10 }, width: "100%" }}
            >
                <Container maxWidth="lg">
                    {/* Encabezado de sección */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 5 }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: TEAL_MID, mb: 0.5 }}>
                                Cursos Pendientes de Revisión
                            </Typography>
                            <Typography sx={{ color: "#64748b" }}>
                                {pendingCourses.length} curso{pendingCourses.length !== 1 ? "s" : ""} esperando aprobación
                            </Typography>
                        </Box>

                        <Chip
                            icon={<HourglassEmptyIcon sx={{ fontSize: 16 }} />}
                            label={`${pendingCourses.length} pendientes`}
                            sx={{
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                px: 1,
                            }}
                        />
                    </Stack>

                    {pendingCourses.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 10 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#86efac", mb: 2 }} />
                            <Typography variant="h6" sx={{ color: "#64748b" }}>
                                No hay cursos pendientes de revisión. ¡Todo al día!
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {pendingCourses.map((course) => (
                                <Grid xs={12} sm={6} md={4} lg={3} key={course.id}>
                                    <Card
                                        sx={{
                                            maxWidth: 350,
                                            width: "100%",
                                            margin: "0 auto",
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
                                                height: 160,
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
                                            {!course.cover_image && (
                                                <SchoolIcon sx={{ fontSize: 60, color: "#fff" }} />
                                            )}
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                            {/* Badge de estado */}
                                            <Chip
                                                label="En revisión"
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#dbeafe",
                                                    color: "#1d4ed8",
                                                    fontWeight: 700,
                                                    mb: 1.5,
                                                    alignSelf: "flex-start",
                                                }}
                                            />

                                            {/* Título */}
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
                                                    minHeight: 56,
                                                }}
                                            >
                                                {course.title}
                                            </Typography>

                                            {/* Descripción */}
                                            <Typography
                                                sx={{
                                                    color: "#64748b",
                                                    fontSize: "0.875rem",
                                                    mb: 1.5,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    minHeight: 42,
                                                }}
                                            >
                                                {course.description || "Sin descripción disponible"}
                                            </Typography>

                                            {/* Meta: tutor y fecha */}
                                            <Stack spacing={0.25} sx={{ mb: 2 }}>
                                                <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                                                    Tutor: <strong style={{ color: "#475569" }}>{course.tutor}</strong>
                                                </Typography>
                                                <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                                                    Enviado: {course.submitted_at}
                                                </Typography>
                                            </Stack>

                                            {/* Acciones */}
                                            <Stack spacing={1} sx={{ mt: "auto" }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<CheckCircleOutlineIcon />}
                                                    onClick={() => navigate(`/admin/courses/${course.id}/review`)}
                                                    sx={{
                                                        backgroundColor: TEAL,
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        borderRadius: 3,
                                                        "&:hover": { backgroundColor: TEAL_MID },
                                                    }}
                                                >
                                                    Revisar curso
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* ── Banner CTA: ir a usuarios ─────────────────────────────────── */}
            <Box
                sx={{
                    backgroundColor: TEAL_MID,
                    py: { xs: 7, md: 9 },
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <Container maxWidth="sm">
                    <PeopleAltIcon sx={{ fontSize: 52, color: "#5eead4", mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 1.5 }}>
                        ¿Necesitas gestionar usuarios?
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}>
                        Administra tutores y estudiantes: activa cuentas, asigna roles y mantén
                        la comunidad organizada.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<PeopleAltIcon />}
                        onClick={() => navigate("/admin/users")}
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
                        Ver listado de usuarios
                    </Button>
                </Container>
            </Box>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <Box sx={{ backgroundColor: TEAL_DARK, py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>
        </Box>
    );
}

export default AdminDashboard;