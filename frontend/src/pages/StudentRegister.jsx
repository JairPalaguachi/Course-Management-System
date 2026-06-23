import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../services/authService';

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
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function StudentRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            await registerStudent(formData);
            setSuccess('Estudiante registrado exitosamente. Redirigiendo al login...');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            if (err.response?.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError('Ocurrió un error al registrar el estudiante.');
            }
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
            {/* Botón para regresar a la selección de Rol */}
            <Box sx={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/register")}
                    sx={{
                        color: "#10423f",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "rgba(16,66,63,0.08)" },
                    }}
                >
                    Volver atrás
                </Button>
            </Box>

            {/* Círculos decorativos idénticos al ecosistema visual */}
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

            {/* Contenedor del Formulario */}
            <Container maxWidth="sm" sx={{ pt: { xs: 10, md: 12 }, pb: 6, position: "relative", zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 12px 40px rgba(15,118,110,0.08)",
                    }}
                >
                    {/* Encabezado del Perfil Estudiante */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Box sx={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 56, height: 56, borderRadius: "16px",
                            background: "linear-gradient(145deg, #0a2e2b 0%, #10423f 100%)",
                            mb: 2,
                            boxShadow: "0 4px 14px rgba(10,46,43,0.25)"
                        }}>
                            <WorkspacePremiumIcon sx={{ fontSize: 28, color: "#fff" }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#10423f", mb: 1 }}>
                            Registro de Estudiante
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Crea tu cuenta y comienza a explorar e inscribirte en cursos.
                        </Typography>
                    </Box>

                    {/* Alertas de Feedback */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Nombre de usuario"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
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
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: "#0f766e" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />

                            {/* Fila colapsable: Nombre y Apellido juntos en escritorio */}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon sx={{ color: "#0f766e" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={textFieldStyles}
                                />

                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon sx={{ color: "#0f766e" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={textFieldStyles}
                                />
                            </Stack>

                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
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

                            <TextField
                                fullWidth
                                label="Confirmar contraseña"
                                name="password_confirm"
                                type={showPassword ? "text" : "password"}
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: "#0f766e" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyles}
                            />

                            {/* Botón de envío llamativo (Ámbar corporativo) */}
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
                                    backgroundColor: "#f59e0b",
                                    color: "#1c1917",
                                    boxShadow: "0 4px 24px rgba(245,158,11,0.3)",
                                    "&:hover": {
                                        backgroundColor: "#d97706",
                                        boxShadow: "0 6px 28px rgba(245,158,11,0.4)",
                                    },
                                    textTransform: "none",
                                    mt: 1,
                                }}
                            >
                                Registrarme como Estudiante
                            </Button>
                        </Stack>
                    </form>

                    {/* Link alternativo */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            ¿Ya tienes cuenta de estudiante?{" "}
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

            {/* Footer Integrado */}
            <Box sx={{ backgroundColor: "#0a2e2b", py: 2.5, textAlign: "center", width: "100%" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                    © {new Date().getFullYear()} Course Management System · Tech Solution · ESPOL
                </Typography>
            </Box>
        </Box>
    );
}

// Estilos globales de campos personalizados para el ecosistema de la app
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

export default StudentRegister;