// TutorDashboard.jsx
import { useState } from "react";
import {
    Alert,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function TutorDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [courseId, setCourseId] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [loadingLookup, setLoadingLookup] = useState(false);

    const statusColors = {
        borrador: { color: "default", label: "Borrador" },
        pendiente_aprobacion: { color: "warning", label: "Pendiente de aprobación" },
        publicado: { color: "success", label: "Publicado" },
        rechazado: { color: "error", label: "Rechazado" },
    };

    const handleLookup = async () => {
        if (!courseId.trim()) {
            return;
        }

        setLoadingLookup(true);
        setCourseData(null);
        setFeedback(null);

        try {
            const response = await api.get(`/tutor/courses/${courseId.trim()}/`);
            setCourseData(response.data);
        } catch (lookupError) {
            setFeedback({
                type: "error",
                text:
                    lookupError?.response?.data?.detail ||
                    "No se encontró el curso.",
            });
        } finally {
            setLoadingLookup(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        };

    const handleRequestPublication = (event) => {
        event.preventDefault();

        if (!courseId.trim()) {
            setFeedback({
                type: "error",
                text: "Ingresa el ID del curso.",
            });
            return;
        }

        setOpenConfirm(true);
    };

    const confirmPublication = async () => {
        setOpenConfirm(false);
        setLoading(true);
        setFeedback(null);

        try {
            const pubResponse = await api.post(`/tutor/courses/${courseId.trim()}/request-publication/`);
            setCourseData(pubResponse.data.course);

            setFeedback({
                type: "success",
                text: "Solicitud de publicación enviada correctamente.",
            });
        } catch (requestError) {
            setFeedback({
                type: "error",
                text:
                    requestError?.response?.data?.detail ||
                    "No se pudo solicitar la publicación del curso.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                Dashboard Tutor
            </Typography>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Stack component="form" spacing={2} onSubmit={handleRequestPublication}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Administrar curso
                    </Typography>
                    <Typography sx={{ color: "#64748b" }}>
                        Ingresa el ID de un curso propio para consultar su estado o solicitar su publicación.
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <TextField
                            label="ID del curso"
                            value={courseId}
                            onChange={(event) => setCourseId(event.target.value)}
                            type="number"
                            inputProps={{ min: 1 }}
                            sx={{ flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleLookup}
                            disabled={loadingLookup || !courseId.trim()}
                            sx={{ mt: 1 }}
                        >
                            {loadingLookup ? "Buscando..." : "Consultar"}
                        </Button>
                    </Stack>

                    {courseData ? (
                        <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                {courseData.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                    Estado:
                                </Typography>
                                <Chip
                                    size="small"
                                    label={
                                        statusColors[courseData.status]?.label || courseData.status
                                    }
                                    color={
                                        statusColors[courseData.status]?.color || "default"
                                    }
                                />
                            </Stack>
                        </Paper>
                    ) : null}

                    {feedback ? (
                        <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
                            {feedback.text}
                        </Alert>
                    ) : null}

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading || !courseData}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        {loading ? "Enviando..." : "Solicitar publicación"}
                    </Button>
                </Stack>
            </Paper>
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Confirmar envío</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de solicitar la publicación de este curso?
                        Esta acción enviará el curso a revisión por un administrador.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>
                        Cancelar
                    </Button>

                    <Button
                        onClick={confirmPublication}
                        variant="contained"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
            >
                Cerrar sesión
            </Button>
        </Stack>
    );
}
export default TutorDashboard;