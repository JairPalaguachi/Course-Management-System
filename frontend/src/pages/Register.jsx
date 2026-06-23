import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

function Register() {
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* Botón para regresar al Home */}
            <Box sx={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                        color: "#10423f",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "rgba(16,66,63,0.08)" },
                    }}
                >
                    Volver al inicio
                </Button>
            </Box>

            {/* Elementos decorativos de fondo */}
            <Box sx={{
                position: "absolute", top: -100, right: -100,
                width: 400, height: 400, borderRadius: "50%",
                background: "rgba(15,118,110,0.06)", pointerEvents: "none",
            }} />
            <Box sx={{
                position: "absolute", bottom: 100, left: -80,
                width: 320, height: 320, borderRadius: "50%",
                background: "rgba(16,66,63,0.04)", pointerEvents: "none",
            }} />

            {/* Contenedor Principal */}
            <Container maxWidth="md" sx={{ pt: { xs: 12, md: 16 }, pb: 6, position: "relative", zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 40px rgba(15,118,110,0.08)",
                        textAlign: "center"
                    }}
                >
                    {/* Encabezado / Branding */}
                    <Box sx={{ mb: 6 }}>
                        <Box sx={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 64, height: 64, borderRadius: "20px",
                            background: "linear-gradient(145deg, #0a2e2b 0%, #10423f 100%)",
                            mb: 2,
                            boxShadow: "0 4px 14px rgba(10,46,43,0.25)"
                        }}>
                            <SchoolIcon sx={{ fontSize: 32, color: "#fff" }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#10423f", mb: 1.5 }}>
                            Únete a ElearningGo
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 480, mx: "auto" }}>
                            Para comenzar, selecciona el tipo de cuenta que deseas crear de acuerdo a tu rol en la plataforma.
                        </Typography>
                    </Box>

                    {/* Opciones de Registro como Tarjetas Grandes */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 2 }}>
                        
                        {/* Opción Estudiante */}
                        <Box
                            onClick={() => navigate("/register/student/")}
                            sx={{
                                flex: 1,
                                p: 4,
                                borderRadius: 4,
                                border: "2px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                transition: "all 0.25s ease-in-out",
                                cursor: "pointer",
                                "&:hover": {
                                    borderColor: "#0f766e",
                                    backgroundColor: "#f0faf8",
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 24px rgba(15,118,110,0.08)"
                                }
                            }}
                        >
                            <Box sx={{
                                width: 48, height: 48, borderRadius: "12px",
                                backgroundColor: "rgba(15,118,110,0.1)",
                                display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2
                            }}>
                                <MenuBookIcon sx={{ fontSize: 26, color: "#0f766e" }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#10423f", mb: 1 }}>
                                Soy Estudiante
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5 }}>
                                Quiero explorar el catálogo de cursos, inscribirme en nuevas clases y aprender de los mejores expertos.
                            </Typography>
                        </Box>

                        {/* Opción Tutor */}
                        <Box
                            onClick={() => navigate("/register/tutor/")}
                            sx={{
                                flex: 1,
                                p: 4,
                                borderRadius: 4,
                                border: "2px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                transition: "all 0.25s ease-in-out",
                                cursor: "pointer",
                                "&:hover": {
                                    borderColor: "#0f766e",
                                    backgroundColor: "#f0faf8",
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 24px rgba(15,118,110,0.08)"
                                }
                            }}
                        >
                            <Box sx={{
                                width: 48, height: 48, borderRadius: "12px",
                                backgroundColor: "rgba(15,118,110,0.1)",
                                display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2
                            }}>
                                <WorkspacePremiumIcon sx={{ fontSize: 26, color: "#0f766e" }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#10423f", mb: 1 }}>
                                Soy Tutor / Profesor
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5 }}>
                                Quiero publicar contenido, gestionar mis alumnos, impartir clases y certificar nuevos profesionales.
                            </Typography>
                        </Box>

                    </Stack>

                    {/* Redirección a Login */}
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            ¿Ya tienes una cuenta?{" "}
                            <Button
                                onClick={() => navigate("/login")}
                                sx={{
                                    color: "#0f766e",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    p: 0,
                                    minWidth: "auto",
                                    verticalAlign: "baseline",
                                    "&:hover": { textDecoration: "underline", backgroundColor: "transparent" }
                                }}
                            >
                                Iniciar sesión
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Footer */}
            <Box sx={{ backgroundColor: "#0a2e2b", py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>
        </Box>
    );
}

export default Register;