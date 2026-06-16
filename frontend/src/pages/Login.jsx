import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

import api from "../services/api";
import { useAuth } from "../context/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } catch {
            console.log(error.response?.data);
            setError("Credenciales inválidas");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Card
                    sx={{
                        width: "100%",
                        p: 3,
                        borderRadius: 4,
                        boxShadow: 8,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight="bold"
                            color="#10423f"
                            gutterBottom
                        >
                            Course Management
                        </Typography>

                        <Typography
                            variant="body1"
                            align="center"
                            sx={{ mb: 3 }}
                        >
                            Iniciar sesión
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Correo electrónico"
                                placeholder="ejemplo@correo.com"
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        backgroundColor: "#ffffff",
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#666",
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                type="password"
                                label="Contraseña"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    backgroundColor: "#0f766e",
                                    "&:hover": {
                                        backgroundColor: "#115e59",
                                    },
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default Login;