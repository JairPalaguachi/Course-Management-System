import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Button, Container, Typography, Chip,
    Card, CardContent, Grid, CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { getAdminCourses } from "../../services/courseService";
import { formatDate, getStatusLabel, getStatusColor } from "../../components/courseUtils";

const TEAL_DARK = "#0a2e2b";
const TEAL_MID = "#10423f";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

function AdminCourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getAdminCourses();
                setCourses(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los cursos.");
            } finally {
                setLoading(false);
            }
        };
        loadCourses();
    }, []);

    return (
        <Box sx={{
            minHeight: "100vh", backgroundColor: TEAL_LIGHT,
            width: "100vw", position: "relative", left: "50%", right: "50%",
            marginLeft: "-50vw", marginRight: "-50vw", overflowX: "hidden",
        }}>
            {/* Header */}
            <Box sx={{
                background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, width: "100%",
            }}>
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/admin/dashboard")}
                        sx={{ color: "rgba(255,255,255,0.65)", textTransform: "none", mb: 2, px: 0,
                              "&:hover": { color: "#fff", background: "transparent" } }}
                    >
                        Panel de administrador
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", mb: 0.5 }}>
                        Gestión de cursos
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
                        Edita cualquier curso registrado en la plataforma.
                    </Typography>
                </Container>
            </Box>

            {/* Contenido */}
            <Container maxWidth="lg" sx={{ py: 5 }}>
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress sx={{ color: TEAL }} />
                    </Box>
                )}

                {error && (
                    <Box sx={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 3,
                                px: 2, py: 1.5, mb: 2.5, color: "#b91c1c" }}>
                        {error}
                    </Box>
                )}

                {!loading && !error && courses.length === 0 && (
                    <Typography sx={{ textAlign: "center", color: "#94a3b8", py: 8 }}>
                        No hay cursos registrados todavía.
                    </Typography>
                )}

                <Grid container spacing={3}>
                    {courses.map((course) => {
                        const statusColor = getStatusColor(course.status);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                <Card sx={{
                                    borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none",
                                    height: "100%", display: "flex", flexDirection: "column",
                                    transition: "all 0.2s ease",
                                    "&:hover": { boxShadow: "0 12px 32px rgba(15,118,110,0.12)", transform: "translateY(-3px)" },
                                }}>
                                    <Box sx={{
                                        height: 130,
                                        backgroundImage: course.cover_image ? `url(${course.cover_image})` : `linear-gradient(145deg, ${TEAL_DARK}, ${TEAL})`,
                                        backgroundSize: "cover", backgroundPosition: "center",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {!course.cover_image && <SchoolIcon sx={{ fontSize: 46, color: "#fff" }} />}
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Chip
                                            label={getStatusLabel(course.status)}
                                            size="small"
                                            sx={{ backgroundColor: statusColor.bg, color: statusColor.color,
                                                  fontWeight: 700, mb: 1.5, alignSelf: "flex-start" }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: TEAL_DARK, mb: 0.5 }}>
                                            {course.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, color: "#94a3b8", mb: 2 }}>
                                            Tutor: {course.tutor_username || "—"} · {formatDate(course.updated_at || course.created_at)}
                                        </Typography>
                                        <Button
                                            fullWidth variant="contained" startIcon={<EditIcon />}
                                            onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                                            sx={{ mt: "auto", backgroundColor: TEAL, textTransform: "none",
                                                  fontWeight: 700, borderRadius: 3,
                                                  "&:hover": { backgroundColor: TEAL_MID } }}
                                        >
                                            Editar curso
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminCourseList;