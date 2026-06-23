import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";

const FEATURES = [
    {
        icon: <AutoStoriesIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Catálogo de Cursos",
        desc: "Explora cientos de cursos organizados por área y nivel.",
    },
    {
        icon: <GroupsIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Tutores Expertos",
        desc: "Aprende de profesionales con experiencia real en cada campo.",
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 32, color: "#0f766e" }} />,
        title: "Cursos Verificados",
        desc: "Contenido revisado y aprobado por nuestro equipo académico.",
    },
];

const CHIPS = [
    "Tecnología", "Diseño", "Matemáticas",
    "Programación", "Negocios", "Ciencias",
    "Idiomas", "Arte",
];

function Home() {
    const navigate = useNavigate();

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
                            fontSize: "1.72rem",
                        }}
                    >
                       
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
                        ElearningGo
                        <Box
                            component="span"
                            sx={{
                                display: "block",
                                color: "#5eead4",
                            }}
                        >
                            Aprende sin límites
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
                        Plataforma académica para estudiantes, tutores y administradores.
                        Cursos verificados, gestión centralizada y seguimiento en tiempo real.
                    </Typography>

                    {/* CTA buttons */}

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "480px",
                            mx: "auto",
                        }}
                    >

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigate("/register")}
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
                                minWidth: 200,
                            }}
                        >
                            Crear cuenta gratis
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<LoginIcon />}
                            onClick={() => navigate("/login")}
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
                                minWidth: 200,
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </Stack>

                    {/* category chips */}
                    <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                        {CHIPS.map((label) => (
                            <Chip
                                key={label}
                                label={label}
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.78)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    fontSize: "0.78rem",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
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
                    Todo lo que necesitas en un solo lugar
                </Typography>
                <Typography align="center" sx={{ color: "#64748b", mb: 6, maxWidth: 480, mx: "auto" }}>
                    Diseñado para que estudiantes, tutores y administradores trabajen juntos de forma fluida.
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    justifyContent="center"
                >
                    {FEATURES.map(({ icon, title, desc }) => (
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
                        ¿Listo para empezar?
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}>
                        Únete a la plataforma, elige tu rol y comienza hoy mismo.
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigate("/register")}
                            sx={{
                                px: 4, py: 1.5, borderRadius: 3,
                                fontWeight: 700, textTransform: "none",
                                backgroundColor: "#f59e0b", color: "#1c1917",
                                "&:hover": { backgroundColor: "#d97706" },
                            }}
                        >
                            Registrarme ahora
                        </Button>
                        <Button
                            variant="text"
                            size="large"
                            startIcon={<LoginIcon />}
                            onClick={() => navigate("/login")}
                            sx={{
                                px: 4, py: 1.5, borderRadius: 3,
                                fontWeight: 600, textTransform: "none",
                                color: "rgba(255,255,255,0.8)",
                                "&:hover": { color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)" },
                            }}
                        >
                            Ya tengo cuenta
                        </Button>
                    </Stack>
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

export default Home;