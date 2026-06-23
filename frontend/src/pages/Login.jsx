import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Stack,
    Paper,
    InputAdornment,
    IconButton,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import api from "../services/api";
import { useAuth } from "../context/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login/", {
                username,
                password,
            });
            
            const { access, refresh, user } = response.data;

            login(user, access, refresh);

            if (user.role === "student") {
                navigate("/student/dashboard");
            } else if (user.role === "tutor") {
                navigate("/tutor/dashboard");
            } else if (user.role === "admin") {
                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.log(err.response?.data);
            setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        }
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* Botón flotante para regresar al Home */}
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

            {/* Círculos decorativos de fondo */}
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

            {/* Contenedor de la Tarjeta */}
            <Container maxWidth="sm" sx={{ pt: { xs: 12, md: 16 }, pb: 6, position: "relative", zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 5 },
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 40px rgba(15,118,110,0.08)",
                    }}
                >
                    {/* Encabezado / Identidad de marca */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Box sx={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 56, height: 56, borderRadius: "16px",
                            background: "linear-gradient(145deg, #0a2e2b 0%, #10423f 100%)",
                            mb: 2,
                            boxShadow: "0 4px 14px rgba(10,46,43,0.25)"
                        }}>
                            <LockOpenIcon sx={{ fontSize: 28, color: "#fff" }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#10423f", mb: 1 }}>
                            ¡Hola de nuevo!
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Ingresa tus credenciales para acceder a tu panel de control
                        </Typography>
                    </Box>

                    {/* Alerta de Error */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Formulario de Login */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Nombre de usuario"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: "#0f766e" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />

                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                label="Contraseña"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: "#0f766e" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={textFieldStyles}
                            />

                            {/* Botón de envío */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{
                                    py: 1.6,
                                    borderRadius: 3,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    backgroundColor: "#0f766e",
                                    color: "#ffffff",
                                    boxShadow: "0 4px 20px rgba(15,118,110,0.2)",
                                    "&:hover": {
                                        backgroundColor: "#115e59",
                                        boxShadow: "0 6px 24px rgba(15,118,110,0.3)",
                                    },
                                    textTransform: "none",
                                    mt: 1,
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </Stack>
                    </form>

                    {/* Redirección al registro global */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            ¿No tienes una cuenta todavía?{" "}
                            <Button
                                onClick={() => navigate("/register")}
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
                                Registrarse
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            {/* Footer Unificado */}
            <Box sx={{ backgroundColor: "#0a2e2b", py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>
        </Box>
    );
}

// Configuración de estilos reactivos para inputs consistentes
const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2.5,
        backgroundColor: "#ffffff",
        "&.Mui-focused fieldset": {
            borderColor: "#0f766e",
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#0f766e",
    },
};

export default Login;