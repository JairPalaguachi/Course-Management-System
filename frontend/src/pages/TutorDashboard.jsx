import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ForumIcon from "@mui/icons-material/Forum";
import LogoutIcon from "@mui/icons-material/Logout";

const TUTOR_FEATURES = [
    {
        icon: <PlayLessonIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Creación de Cursos",
        desc: "Diseña tu plan de estudios, sube videos y materiales complementarios con facilidad.",
    },
    {
        icon: <AssessmentIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Gestión de Evaluaciones",
        desc: "Crea cuestionarios y tareas para medir el progreso real de tus estudiantes.",
    },
    {
        icon: <ForumIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Interacción Directa",
        desc: "Resuelve dudas y comunícate con los alumnos inscritos en tus programas.",
    },
];

const QUICK_STATS = [
    "Mis Cursos", "Borradores", "Estudiantes",
    "Evaluaciones", "Mensajes", "Estadísticas"
];

function TutorDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f0faf8",
                width: "100vw",
                position: "relative",
                left: "50%",
                right: "50%",
                marginLeft: "-50vw",
                marginRight: "-50vw",
                overflowX: "hidden",
            }}
        >
            {/* ── Hero ── */}
            <Box
                sx={{
                    background: "linear-gradient(145deg, #0a2e2b 0%, #10423f 55%, #0f766e 100%)",
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 12 },
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                }}
            >
                {/* decorative circles */}
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

                    {/* brand icon */}
                    <Box sx={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 72, height: 72, borderRadius: "20px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        mb: 3,
                    }}>
                        <SchoolIcon sx={{ fontSize: 38, color: "#fff" }} />
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
                        BIENVENIDO, TUTOR
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
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                color: "#5eead4",
                            }}
                        >
                            Control Académico
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
                        Gestiona tus contenidos, crea nuevos cursos y monitorea el progreso de tus estudiantes desde un solo lugar.
                    </Typography>

                    {/* CTA buttons */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "500px",
                            mx: "auto",
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => navigate("/tutor/courses/create")}
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
                            Crear un Curso
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<LibraryBooksIcon />}
                            onClick={() => navigate("/tutor/courses")}
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
                            Mis Cursos
                        </Button>
                    </Stack>

                    {/* Quick links/stats chips */}
                    <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                        {QUICK_STATS.map((label) => (
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

            {/* ── Feature cards ── */}
            <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 700, color: "#10423f", mb: 1 }}
                >
                    Herramientas a tu disposición
                </Typography>
                <Typography align="center" sx={{ color: "#64748b", mb: 6, maxWidth: 480, mx: "auto" }}>
                    Administra tu catálogo educativo con potentes herramientas diseñadas para facilitar tu labor como educador.
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    justifyContent="center"
                >
                    {TUTOR_FEATURES.map(({ icon, title, desc }) => (
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
                            <Typography sx={{ fontWeight: 700, color: "#10423f", mb: 1 }}>
                                {title}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                {desc}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Container>

            {/* ── Bottom CTA banner ── */}
            <Box
                sx={{
                    backgroundColor: "#10423f",
                    py: { xs: 7, md: 9 },
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <Container maxWidth="sm">
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, color: "#ffffff", mb: 1.5 }}
                    >
                        ¿Listo para compartir tu conocimiento?
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}>
                        Empieza a estructurar tu próximo curso hoy mismo y alcanza a miles de estudiantes en nuestra plataforma.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate("/tutor/courses/create")}
                        sx={{
                            px: 4, py: 1.5, borderRadius: 3,
                            fontWeight: 700, textTransform: "none",
                            backgroundColor: "#f59e0b", color: "#1c1917",
                            "&:hover": { backgroundColor: "#d97706" },
                        }}
                    >
                        Comenzar a Crear
                    </Button>
                </Container>
            </Box>

            {/* ── Footer ── */}
            <Box sx={{ backgroundColor: "#0a2e2b", py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>
        </Box>
    );
}

export default TutorDashboard;