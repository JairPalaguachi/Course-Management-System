import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, FormControl, Grid, InputLabel, MenuItem,
    Select, Stack, TextField, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import { getAdminCourseDetail, updateAdminCourse, getCategories } from "../../services/courseService";
import { getStatusLabel, getStatusColor } from "../../components/courseUtils";

const TEAL_DARK = "#0a2e2b";
const TEAL_MID = "#10423f";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

const cardSx = { backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 4, boxShadow: "none" };
const sectionTitleSx = {
    fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.6px",
    textTransform: "uppercase", mb: 2,
};
const inputSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#fff",
        "&.Mui-focused fieldset": { borderColor: TEAL } },
    "& label.Mui-focused": { color: TEAL },
};

const LEVELS = [
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
];

function AdminCourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState("draft");
    const [formData, setFormData] = useState({
        title: "", description: "", category: "", duration: "",
        level: "beginner", objectives: "", preview_video: "", language: "Español",
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const course = await getAdminCourseDetail(id);
                setFormData({
                    title: course.title || "",
                    description: course.description || "",
                    category: course.category || "",
                    duration: course.duration || "",
                    level: course.level || "beginner",
                    objectives: course.objectives || "",
                    preview_video: course.preview_video || "",
                    language: course.language || "Español",
                });
                setStatus(course.status || "draft");
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el curso.");
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategories(await getCategories());
            } catch (err) {
                console.error("Error al cargar categorías:", err);
            }
        };
        loadCategories();
    }, []);

    const field = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

    const validate = () => {
        if (!formData.title.trim()) return "El título es obligatorio.";
        if (!formData.description.trim()) return "La descripción es obligatoria.";
        if (!formData.category) return "La categoría es obligatoria.";
        if (!formData.duration || Number(formData.duration) <= 0) return "La duración debe ser mayor a 0.";
        return "";
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        setLoading(true);
        try {
            const result = await updateAdminCourse(id, {
                title: formData.title,
                description: formData.description,
                category: Number(formData.category),
                duration: Number(formData.duration),
                level: formData.level,
                objectives: formData.objectives,
                preview_video: formData.preview_video,
                language: formData.language,
            });
            if (result.status) setStatus(result.status);
            setSuccess("Curso actualizado exitosamente.");
        } catch (err) {
            console.error(err);
            setError("No se pudo guardar el curso. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                <CircularProgress sx={{ color: TEAL }} />
            </Box>
        );
    }

    const statusColor = getStatusColor(status);

    return (
        <Box sx={{
            minHeight: "100vh", backgroundColor: TEAL_LIGHT,
            width: "100vw", position: "relative", left: "50%", right: "50%",
            marginLeft: "-50vw", marginRight: "-50vw", overflowX: "hidden",
        }}>
            <Box sx={{
                background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, width: "100%",
            }}>
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/admin/courses")}
                        sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", mb: 2, px: 0,
                              "&:hover": { color: "#fff", background: "transparent" } }}
                    >
                        Cursos
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff" }}>
                            Editar curso (administrador)
                        </Typography>
                        <Chip
                            label={getStatusLabel(status)}
                            size="small"
                            sx={{ backgroundColor: statusColor.bg, color: statusColor.color, fontWeight: 700 }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ pt: 3.5, pb: 10 }}>
                {error && (
                    <Box sx={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3,
                                px: 2, py: 1.5, mb: 2.5, color: "#b91c1c" }}>
                        {error}
                    </Box>
                )}
                {success && (
                    <Box sx={{ background: TEAL_MID, borderRadius: 3, px: 2, py: 1.5, mb: 2.5,
                                color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon sx={{ color: "#5eead4", fontSize: 20 }} />
                        {success}
                    </Box>
                )}

                <Card sx={cardSx}>
                    <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
                        <Typography sx={sectionTitleSx}>Información general</Typography>

                        <TextField fullWidth label="Título del curso *" size="small"
                            value={formData.title} onChange={field("title")} sx={{ mb: 2, ...inputSx }} />

                        <TextField fullWidth label="Descripción corta *" size="small" multiline rows={3}
                            value={formData.description} onChange={field("description")} sx={{ mb: 2, ...inputSx }} />

                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Categoría *</InputLabel>
                                    <Select value={formData.category} label="Categoría *" onChange={field("category")} sx={inputSx}>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField fullWidth size="small" label="Duración (horas) *" type="number"
                                    value={formData.duration} onChange={field("duration")}
                                    inputProps={{ min: 1 }} sx={inputSx} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Nivel</InputLabel>
                                    <Select value={formData.level} label="Nivel" onChange={field("level")} sx={inputSx}>
                                        {LEVELS.map((l) => (
                                            <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <TextField fullWidth label="Objetivos de aprendizaje" size="small" multiline rows={3}
                            value={formData.objectives} onChange={field("objectives")} sx={{ mb: 2, ...inputSx }} />

                        <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={8}>
                                <TextField fullWidth size="small" label="Video de presentación (URL)"
                                    value={formData.preview_video} onChange={field("preview_video")} sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Idioma</InputLabel>
                                    <Select value={formData.language} label="Idioma" onChange={field("language")} sx={inputSx}>
                                        {["Español", "Inglés", "Portugués"].map((l) => (
                                            <MenuItem key={l} value={l}>{l}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                        variant="contained" size="large"
                        startIcon={loading ? <CircularProgress size={15} sx={{ color: "#fff" }} /> : <SaveIcon />}
                        onClick={handleSubmit} disabled={loading}
                        sx={{ py: 1.4, px: 4, borderRadius: 3, fontWeight: 700, textTransform: "none",
                              backgroundColor: TEAL, "&:hover": { backgroundColor: TEAL_MID } }}
                    >
                        Guardar cambios
                    </Button>
                    <Button
                        variant="outlined" size="large"
                        onClick={() => navigate("/admin/courses")}
                        sx={{ py: 1.4, px: 4, borderRadius: 3, fontWeight: 600, textTransform: "none",
                              borderColor: TEAL, color: TEAL, "&:hover": { background: TEAL_LIGHT } }}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}

export default AdminCourseEdit;