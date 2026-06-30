import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    Pagination,
    Paper,
    Stack,
    Typography,
    CircularProgress,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";
import BasicFilters from "../components/BasicFilters";
import CourseDetailDialog from "../components/CourseDetailDialog";

const PAGE_SIZE = 9;

const LEVEL_OPTIONS = [
    { value: "", label: "Todos los niveles" },
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" },
];

const DURATION_OPTIONS = [
    { key: "all", label: "Cualquier duración", params: {} },
    { key: "short", label: "Hasta 4 horas", params: { max_duration: 240 } },
    { key: "medium", label: "4 a 8 horas", params: { min_duration: 240, max_duration: 480 } },
    { key: "long", label: "Más de 8 horas", params: { min_duration: 480 } },
];

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");
    const [durationKey, setDurationKey] = useState("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        let isActive = true;

        const loadCatalog = async () => {
            setLoading(true);
            setError("");

            const durationFilters = DURATION_OPTIONS.find((option) => option.key === durationKey)?.params ?? {};
            const params = {
                page,
                page_size: PAGE_SIZE,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (level) {
                params.level = level;
            }

            Object.assign(params, durationFilters);

            try {
                const response = await api.get("/courses/public/", { params });
                if (!isActive) {
                    return;
                }

                const payload = response.data;
                const results = Array.isArray(payload) ? payload : payload?.results ?? [];
                const count = Array.isArray(payload) ? payload.length : payload?.count ?? results.length;

                setCourses(results);
                setTotalCount(count);
            } catch (requestError) {
                if (!isActive) {
                    return;
                }

                setError(
                    requestError?.response?.data?.detail ||
                        "No pudimos cargar el catálogo de cursos. Intenta nuevamente en unos segundos.",
                );
                setCourses([]);
                setTotalCount(0);
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        loadCatalog();

        return () => {
            isActive = false;
        };
    }, [durationKey, level, page, search]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const handleOpenCourse = (course) => {
        setSelectedCourse(course);
    };

    const handleCloseCourse = () => {
        setSelectedCourse(null);
    };

    const visibleCount = loading ? "..." : totalCount;
    const catalogStatusText = loading
        ? "Cargando catálogo..."
        : `${courses.length} curso(s) en esta vista`;

    let catalogContent;

    if (loading) {
        catalogContent = (
            <Box
                sx={{
                    minHeight: 260,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "rgba(255,255,255,0.7)",
                    borderRadius: 4,
                    border: "1px dashed rgba(15,118,110,0.2)",
                }}
            >
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress sx={{ color: "#0f766e" }} />
                    <Typography sx={{ color: "#0f766e", fontWeight: 600 }}>
                        Cargando cursos publicados...
                    </Typography>
                </Stack>
            </Box>
        );
    } else if (courses.length === 0) {
        catalogContent = (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    p: { xs: 3, md: 5 },
                    textAlign: "center",
                    border: "1px solid #d9ebe8",
                    backgroundColor: "rgba(255,255,255,0.85)",
                }}
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 4,
                        display: "grid",
                        placeItems: "center",
                        mx: "auto",
                        mb: 2,
                        backgroundColor: "rgba(15,118,110,0.1)",
                        color: "#0f766e",
                    }}
                >
                    <CategoryIcon />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f766e", mb: 1 }}>
                    No encontramos cursos para estos filtros.
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 3, maxWidth: 620, mx: "auto" }}>
                    Prueba cambiando el texto de búsqueda, el nivel o la duración para descubrir más opciones.
                </Typography>
            </Paper>
        );
    } else {
        catalogContent = (
            <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {courses.map((course) => (
                        <Grid xs={12} md={6} lg={4} key={course.id}>
                            <CourseCard course={course} onClick={() => handleOpenCourse(course)} />
                        </Grid>
                    ))}
                </Grid>

                {totalPages > 1 ? (
                    <Stack alignItems="center" sx={{ mb: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                        />
                    </Stack>
                ) : null}
            </>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top left, rgba(15,118,110,0.12), transparent 28%), linear-gradient(180deg, #f7fbfa 0%, #eef7f5 100%)",
                py: { xs: 4, md: 6 },
            }}
        >
            <Container maxWidth="xl">
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 5,
                        overflow: "hidden",
                        border: "1px solid rgba(15,118,110,0.12)",
                        background:
                            "linear-gradient(135deg, rgba(8,47,43,1) 0%, rgba(15,118,110,0.98) 52%, rgba(20,184,166,0.92) 100%)",
                        color: "#fff",
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            p: { xs: 3, md: 5 },
                            display: "grid",
                            gap: 3,
                            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Chip
                                icon={<VerifiedIcon />}
                                label="Catálogo público"
                                sx={{
                                    mb: 2,
                                    backgroundColor: "rgba(255,255,255,0.14)",
                                    color: "#fff",
                                    border: "1px solid rgba(255,255,255,0.16)",
                                }}
                            />
                            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.08, mb: 2 }}>
                                Explora cursos listos para aprender hoy.
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 720, lineHeight: 1.7 }}>
                                Revisa cursos publicados, filtra por nivel o duración y encuentra el punto de partida
                                adecuado sin iniciar sesión.
                            </Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SchoolIcon />}
                                    onClick={() => navigate("/register")}
                                    sx={{
                                        backgroundColor: "#f59e0b",
                                        color: "#1c1917",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        px: 2.5,
                                        "&:hover": { backgroundColor: "#d97706" },
                                    }}
                                >
                                    Crear cuenta
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        borderColor: "rgba(255,255,255,0.42)",
                                        color: "#fff",
                                        textTransform: "none",
                                        px: 2.5,
                                        "&:hover": {
                                            borderColor: "#fff",
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                        },
                                    }}
                                >
                                    Iniciar sesión
                                </Button>
                            </Stack>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                backgroundColor: "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.16)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)" }}>
                                        Cursos visibles
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {visibleCount}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 3,
                                            display: "grid",
                                            placeItems: "center",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                    >
                                        <AutoStoriesIcon />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>Catálogo público</Typography>
                                        <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.92rem" }}>
                                            Cursos publicados y listos para consultar.
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 3,
                                            display: "grid",
                                            placeItems: "center",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                    >
                                        <TrendingUpIcon />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>Filtros rápidos</Typography>
                                        <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.92rem" }}>
                                            Busca por nivel, texto o duración.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        p: { xs: 2, md: 3 },
                        mb: 3,
                        border: "1px solid #d9ebe8",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <Stack spacing={2}>
                        <SearchBar
                            value={search}
                            label="Buscar cursos"
                            placeholder="Ej. programación, marketing, matemáticas..."
                            onChange={(nextValue) => {
                                setSearch(nextValue);
                                setPage(1);
                            }}
                            onClear={() => {
                                setSearch("");
                                setPage(1);
                            }}
                        />

                        <BasicFilters
                            level={level}
                            durationKey={durationKey}
                            levelOptions={LEVEL_OPTIONS}
                            durationOptions={DURATION_OPTIONS}
                            onLevelChange={(nextValue) => {
                                setLevel(nextValue);
                                setPage(1);
                            }}
                            onDurationChange={(nextValue) => {
                                setDurationKey(nextValue);
                                setPage(1);
                            }}
                            onReset={() => {
                                setSearch("");
                                setLevel("");
                                setDurationKey("all");
                                setPage(1);
                            }}
                        />

                        <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                            {catalogStatusText}
                        </Typography>
                    </Stack>
                </Paper>

                {error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : null}

                {catalogContent}

                <Divider sx={{ my: 4, borderColor: "rgba(15,118,110,0.14)" }} />
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                >
                    <Typography sx={{ color: "#64748b" }}>
                        Filtra por tema, duración y nivel para encontrar cursos listos para publicar o explorar.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<VerifiedIcon />}
                        onClick={() => navigate("/register")}
                        sx={{
                            backgroundColor: "#0f766e",
                            textTransform: "none",
                            fontWeight: 700,
                            "&:hover": { backgroundColor: "#115e59" },
                        }}
                    >
                        Crear cuenta para inscribirme
                    </Button>
                </Stack>
            </Container>

            <CourseDetailDialog open={Boolean(selectedCourse)} course={selectedCourse} onClose={handleCloseCourse} />
        </Box>
    );
}

export default Courses;