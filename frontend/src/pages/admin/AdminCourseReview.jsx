import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import QuizIcon from "@mui/icons-material/Quiz";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import {
  getAdminCourseDetail,
  approveAdminCourse,
  rejectAdminCourse,
} from "../../services/courseService";

import {
    formatDuration,
    getLevelLabel,
} from "../../components/courseUtils";

const CONTENT_ICON = {
    video: <VideoLibraryIcon />,
    pdf: <PictureAsPdfIcon />,
    image: <ImageIcon />,
    text: <TextSnippetIcon />,
    quiz: <QuizIcon />,
};

const CONTENT_COLOR = {
    video: "#7c3aed",
    pdf: "#b45309",
    image: "#0891b2",
    text: "#475569",
    quiz: "#059669",
};

const CONTENT_LABEL = {
    video: "Video",
    pdf: "PDF",
    image: "Imagen",
    text: "Texto",
    quiz: "Evaluación",
};

const TEAL_DARK = "#0a2e2b";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

function AdminCourseReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminCourseDetail(id);
                setCourse(data);
            } catch (err) {
                console.error("Error al cargar el curso:", err);

                const status = err.response?.status;

                if (status === 403) {
                    setError(
                        err.response?.data?.detail ||
                            "No tienes permiso para acceder a este curso."
                    );
                } else if (status === 404) {
                    setError(
                        "El curso no existe o ya no está disponible."
                    );
                } else {
                    setError(
                        "No se pudo cargar el curso. Intenta nuevamente."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [id]);

    const handleBack = () => {
        navigate("/admin/dashboard");
    };

    const handleApprove = async () => {
        try {
            setActionLoading(true);
            setError("");

            await approveAdminCourse(id);

            setApproveDialogOpen(false);
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Error al aprobar el curso:", err);

            setError(
                err.response?.data?.detail ||
                    "No se pudo aprobar el curso."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setActionLoading(true);
            setError("");

            await rejectAdminCourse(id);

            setRejectDialogOpen(false);
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Error al rechazar el curso:", err);

            setError(
                err.response?.data?.detail ||
                    "No se pudo rechazar el curso."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const stats = useMemo(() => {
        const sections = course?.sections || [];
        const contents = sections.flatMap((section) => section.contents || []);

        return {
            sections: sections.length,
            contents: contents.length,
            videos: contents.filter((item) => item.type === "video").length,
            documents: contents.filter((item) => item.type === "pdf").length,
            evaluations: contents.filter((item) => item.type === "quiz").length,
        };
    }, [course]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: TEAL_LIGHT,
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress sx={{ color: TEAL }} />
                    <Typography sx={{ color: "#64748b" }}>
                        Cargando curso...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Stack spacing={2}>
                    <Button
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            alignSelf: "flex-start",
                            color: TEAL,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Volver a mis cursos
                    </Button>

                    <Alert severity="error">{error}</Alert>
                </Stack>
            </Container>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: TEAL_LIGHT,
                py: { xs: 2.5, md: 4 },
            }}
        >
            <Container maxWidth="xl">
                {/* Navegación */}
                <Button
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        mb: 2.5,
                        color: TEAL,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                            backgroundColor: "rgba(15,118,110,0.06)",
                        },
                    }}
                >
                    Volver a mis cursos
                </Button>
                    
                {/* ACCIONES DE ADMINISTRADOR */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        mb: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setRejectDialogOpen(true)}
                        disabled={actionLoading}
                        sx={{
                            backgroundColor: "#dc2626",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 3,
                            px: 3,
                            "&:hover": {
                                backgroundColor: "#b91c1c",
                            },
                        }}
                    >
                        Rechazar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => setApproveDialogOpen(true)}
                        disabled={actionLoading}
                        sx={{
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 3,
                            px: 3,
                            "&:hover": {
                                backgroundColor: "#15803d",
                            },
                        }}
                    >
                        Aprobar
                    </Button>
                </Box>

                {/* HERO DEL CURSO */}
                <Card
                    sx={{
                        borderRadius: { xs: 3, md: 5 },
                        overflow: "hidden",
                        border: "1px solid #dbe7e5",
                        boxShadow: "0 14px 40px rgba(10,46,43,0.08)",
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: { xs: 210, sm: 300, md: 380 },
                            backgroundColor: "#e2e8f0",
                            backgroundImage: course.cover_image
                                ? `url(${course.cover_image})`
                                : "linear-gradient(145deg, #0a2e2b, #0f766e)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(10,46,43,0.02) 20%, rgba(10,46,43,0.68) 100%)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                zIndex: 1,
                                left: { xs: 18, md: 34 },
                                bottom: { xs: 18, md: 28 },
                                right: { xs: 18, md: 34 },
                            }}
                        >
                            <Chip
                                icon={<VideoLibraryIcon />}
                                label="Curso en progreso"
                                sx={{
                                    mb: 1.25,
                                    backgroundColor: "#dff7f2",
                                    color: TEAL,
                                    fontWeight: 800,
                                    "& .MuiChip-icon": {
                                        color: TEAL,
                                    },
                                }}
                            />

                            <Typography
                                variant="h2"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 900,
                                    fontSize: {
                                        xs: "2rem",
                                        sm: "2.7rem",
                                        md: "3.6rem",
                                    },
                                    lineHeight: 1.05,
                                    textShadow:
                                        "0 3px 18px rgba(0,0,0,0.28)",
                                }}
                            >
                                {course.title}
                            </Typography>
                        </Box>
                    </Box>

                    <CardContent
                        sx={{
                            p: { xs: 2.5, md: 4 },
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#475569",
                                fontSize: { xs: "0.98rem", md: "1.08rem" },
                                lineHeight: 1.75,
                                maxWidth: 900,
                            }}
                        >
                            {course.description ||
                                "Sin descripción disponible."}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            <CourseInfo
                                icon={<SchoolIcon />}
                                label="Nivel"
                                value={getLevelLabel(course.level)}
                            />

                            <CourseInfo
                                icon={<AccessTimeIcon />}
                                label="Duración"
                                value={formatDuration(course.duration)}
                            />

                            <CourseInfo
                                icon={<MenuBookIcon />}
                                label="Idioma"
                                value={course.language || "Español"}
                            />

                            {course.tutor_username && (
                                <CourseInfo
                                    icon={<SchoolIcon />}
                                    label="Tutor"
                                    value={course.tutor_username}
                                />
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* RESUMEN DEL CURSO */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1.6fr 1fr",
                        },
                        gap: 2.5,
                        mb: 4,
                    }}
                >
                    {/* Objetivos */}
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: "1px solid #dbe7e5",
                            boxShadow: "0 8px 24px rgba(10,46,43,0.05)",
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.5 }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 2.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            "rgba(15,118,110,0.1)",
                                        color: TEAL,
                                    }}
                                >
                                    <EmojiEventsIcon />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "#64748b",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Al finalizar
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            color: TEAL_DARK,
                                            fontWeight: 800,
                                        }}
                                    >
                                        Objetivo del curso
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography
                                sx={{
                                    color: "#475569",
                                    lineHeight: 1.75,
                                }}
                            >
                                {course.objectives ||
                                    "Explora los contenidos del curso y avanza a tu propio ritmo."}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Resumen de contenidos */}
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: "1px solid #dbe7e5",
                            boxShadow: "0 8px 24px rgba(10,46,43,0.05)",
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "#64748b",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    mb: 0.5,
                                }}
                            >
                                Resumen
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 20,
                                    color: TEAL_DARK,
                                    fontWeight: 800,
                                    mb: 2,
                                }}
                            >
                                Tu material de aprendizaje
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, minmax(0, 1fr))",
                                    gap: 1,
                                }}
                            >
                                <MiniStat
                                    value={stats.sections}
                                    label="Secciones"
                                />
                                <MiniStat
                                    value={stats.contents}
                                    label="Contenidos"
                                />
                                <MiniStat
                                    value={stats.videos}
                                    label="Videos"
                                />
                                <MiniStat
                                    value={stats.documents}
                                    label="PDF"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* CONTENIDO */}
                <Box>
                    <Box sx={{ mb: 2.5 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: TEAL_DARK,
                                mb: 0.5,
                                fontSize: { xs: "1.7rem", md: "2.2rem" },
                            }}
                        >
                            Contenido del curso
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                fontSize: "1rem",
                            }}
                        >
                            Revisa las secciones, videos y materiales
                            disponibles.
                        </Typography>
                    </Box>

                    {course.sections?.length > 0 ? (
                        <Stack spacing={2.5}>
                            {course.sections.map(
                                (section, sectionIndex) => (
                                    <SectionCard
                                        key={section.id}
                                        section={section}
                                        index={sectionIndex}
                                    />
                                )
                            )}
                        </Stack>
                    ) : (
                        <Card
                            sx={{
                                borderRadius: 4,
                                border: "1px solid #e2e8f0",
                                boxShadow: "none",
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography sx={{ color: "#64748b" }}>
                                    Este curso todavía no tiene contenido
                                    disponible.
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                {/* PIE */}
                <Box
                    sx={{
                        mt: 5,
                        mb: 2,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg, #0a2e2b 0%, #0f766e 100%)",
                        color: "#fff",
                        textAlign: "center",
                    }}
                >
                    <EmojiEventsIcon
                        sx={{ fontSize: 34, mb: 0.5 }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: 20, md: 24 },
                            fontWeight: 800,
                            mb: 0.5,
                        }}
                    >
                        Sigue avanzando
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.78)",
                            fontSize: 14,
                        }}
                    >
                        Revisa cada recurso y continúa con la siguiente
                        sección.
                    </Typography>
                </Box>
                                {/* MODAL DE APROBACIÓN */}
                <Dialog
                    open={approveDialogOpen}
                    onClose={() =>
                        !actionLoading &&
                        setApproveDialogOpen(false)
                    }
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: TEAL_DARK,
                        }}
                    >
                        Confirmar aprobación
                    </DialogTitle>

                    <DialogContent>
                        <Typography
                            sx={{
                                color: "#475569",
                                fontSize: "1.05rem",
                            }}
                        >
                            ¿Deseas aprobar el curso{" "}
                            <strong>{course.title}</strong>?
                        </Typography>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 3,
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={() =>
                                setApproveDialogOpen(false)
                            }
                            disabled={actionLoading}
                            sx={{
                                color: "#64748b",
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleApprove}
                            disabled={actionLoading}
                            variant="contained"
                            sx={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 800,
                                borderRadius: 3,
                                px: 3,
                                "&:hover": {
                                    backgroundColor: "#15803d",
                                },
                            }}
                        >
                            {actionLoading
                                ? "Aprobando..."
                                : "Aprobar curso"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* MODAL DE RECHAZO */}
                <Dialog
                    open={rejectDialogOpen}
                    onClose={() =>
                        !actionLoading &&
                        setRejectDialogOpen(false)
                    }
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle
                        sx={{
                            fontWeight: 800,
                            color: "#991b1b",
                        }}
                    >
                        Confirmar rechazo
                    </DialogTitle>

                    <DialogContent>
                        <Typography
                            sx={{
                                color: "#475569",
                                fontSize: "1.05rem",
                            }}
                        >
                            ¿Deseas rechazar el curso{" "}
                            <strong>{course.title}</strong>?
                        </Typography>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            px: 3,
                            pb: 3,
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={() =>
                                setRejectDialogOpen(false)
                            }
                            disabled={actionLoading}
                            sx={{
                                color: "#64748b",
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleReject}
                            disabled={actionLoading}
                            variant="contained"
                            sx={{
                                backgroundColor: "#dc2626",
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 800,
                                borderRadius: 3,
                                px: 3,
                                "&:hover": {
                                    backgroundColor: "#b91c1c",
                                },
                            }}
                        >
                            {actionLoading
                                ? "Rechazando..."
                                : "Rechazar curso"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

        </Box>
    );
}

function CourseInfo({ icon, label, value }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 1.5,
                borderRadius: 3,
                backgroundColor: "#f8fafc",
                border: "1px solid #eef2f2",
                minWidth: { xs: "100%", sm: 180 },
            }}
        >
            <Box
                sx={{
                    color: TEAL,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 700,
                        textTransform: "uppercase",
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#334155",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function MiniStat({ value, label }) {
    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 2.5,
                backgroundColor: "#f8fafc",
                border: "1px solid #eef2f2",
            }}
        >
            <Typography
                sx={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: TEAL,
                    lineHeight: 1,
                    mb: 0.5,
                }}
            >
                {value}
            </Typography>

            <Typography
                sx={{
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

function SectionCard({ section, index }) {
    const contentCount = section.contents?.length || 0;

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid #dbe7e5",
                boxShadow: "0 8px 24px rgba(10,46,43,0.05)",
                overflow: "hidden",
            }}
        >
            {/* Encabezado */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: { xs: 2, md: 2.5 },
                    py: 2,
                    background:
                        "linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)",
                    borderBottom: "1px solid #eef2f2",
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        backgroundColor: TEAL,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 5px 14px rgba(15,118,110,0.2)",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 800,
                        }}
                    >
                        {index + 1}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 15, md: 17 },
                            fontWeight: 800,
                            color: TEAL_DARK,
                        }}
                    >
                        {section.name || `Sección ${index + 1}`}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#94a3b8",
                            mt: 0.25,
                        }}
                    >
                        {contentCount}{" "}
                        {contentCount === 1 ? "recurso" : "recursos"}
                    </Typography>
                </Box>

                <Chip
                    label={`${contentCount}`}
                    size="small"
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        backgroundColor: "rgba(15,118,110,0.1)",
                        color: TEAL,
                        fontWeight: 800,
                    }}
                />
            </Box>

            <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                {section.contents?.length > 0 ? (
                    <Stack spacing={1.5}>
                        {section.contents.map((content) => (
                            <ContentItem
                                key={content.id}
                                content={content}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography
                        sx={{
                            color: "#94a3b8",
                            fontSize: 13,
                        }}
                    >
                        Esta sección no tiene contenidos.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

function ContentItem({ content }) {
    const type = content.type || "text";
    const color = CONTENT_COLOR[type] || "#475569";

    return (
        <Box
            sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                p: { xs: 1.5, md: 2 },
                backgroundColor: "#ffffff",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: `${color}55`,
                    boxShadow: `0 8px 20px ${color}12`,
                    transform: "translateY(-1px)",
                },
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        backgroundColor: `${color}12`,
                        color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {CONTENT_ICON[type] || <TextSnippetIcon />}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 13, md: 14 },
                            fontWeight: 800,
                            color: "#334155",
                        }}
                    >
                        {content.label || "Contenido"}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            color,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                        }}
                    >
                        {CONTENT_LABEL[type] || "Contenido"}
                    </Typography>
                </Box>
            </Stack>

            {/* Texto */}
            {type === "text" && content.body && (
                <Typography
                    sx={{
                        mt: 1.5,
                        pt: 1.5,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        fontSize: 13,
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {content.body}
                </Typography>
            )}

            {/* Video */}
            {type === "video" && content.file_url && (
                <Box sx={{ mt: 1.5 }}>
                    <video
                        controls
                        preload="metadata"
                        style={{
                            width: "100%",
                            maxHeight: 520,
                            borderRadius: 12,
                            display: "block",
                            backgroundColor: "#0f172a",
                        }}
                        src={content.file_url}
                    >
                        Tu navegador no soporta la reproducción de video.
                    </video>
                </Box>
            )}

            {/* Imagen */}
            {type === "image" && content.file_url && (
                <Box
                    sx={{
                        mt: 1.5,
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                        borderRadius: 3,
                        p: 1,
                    }}
                >
                    <img
                        src={content.file_url}
                        alt={content.label || "Contenido"}
                        style={{
                            maxWidth: "100%",
                            maxHeight: 500,
                            borderRadius: 10,
                            display: "block",
                        }}
                    />
                </Box>
            )}

            {/* PDF */}
            {type === "pdf" && content.file_url && (
                <Box
                    sx={{
                        mt: 1.5,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fde68a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#92400e",
                            }}
                        >
                            Material de lectura
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#b45309",
                            }}
                        >
                            Abre el documento en una nueva pestaña.
                        </Typography>
                    </Box>

                    <Button
                        component="a"
                        href={content.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon />}
                        sx={{
                            borderColor: "#b45309",
                            color: "#b45309",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 2.5,
                            "&:hover": {
                                borderColor: "#92400e",
                                backgroundColor: "#fef3c7",
                            },
                        }}
                    >
                        Abrir PDF
                    </Button>
                </Box>
            )}

            {/* Evaluación */}
            {type === "quiz" && (
                <Box
                    sx={{
                        mt: 1.5,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#047857",
                            fontWeight: 800,
                        }}
                    >
                        Evaluación de la sección
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#059669",
                            mt: 0.25,
                        }}
                    >
                        Esta sección contiene una evaluación.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

CourseInfo.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

MiniStat.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
};

SectionCard.propTypes = {
    index: PropTypes.number.isRequired,
    section: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
        name: PropTypes.string,
        contents: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]).isRequired,
                type: PropTypes.string,
                label: PropTypes.string,
                body: PropTypes.string,
                file_url: PropTypes.string,
            })
        ),
    }).isRequired,
};

ContentItem.propTypes = {
    content: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
        type: PropTypes.string,
        label: PropTypes.string,
        body: PropTypes.string,
        file_url: PropTypes.string,
    }).isRequired,
};

AdminCourseReview.propTypes = {};

export default AdminCourseReview;
