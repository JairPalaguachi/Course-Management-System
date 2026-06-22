import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorCourses } from "../services/courseService";

import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const TEAL_DARK = "#0a2e2b";
const TEAL_MID = "#10423f";
const TEAL = "#0f766e";
const TEAL_LIGHT = "#f0faf8";

function TutorCourses() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getTutorCourses();
                setCourses(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadCourses();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "draft":
                return {
                    bg: "#fef3c7",
                    color: "#92400e",
                    label: "Borrador",
                };

            case "pending":
                return {
                    bg: "#dbeafe",
                    color: "#1d4ed8",
                    label: "En revisión",
                };

            case "approved":
                return {
                    bg: "#dcfce7",
                    color: "#166534",
                    label: "Aprobado",
                };

            default:
                return {
                    bg: "#e5e7eb",
                    color: "#374151",
                    label: status,
                };
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: TEAL_LIGHT,

                width: "100vw",
                position: "relative",
                left: "50%",
                right: "50%",
                marginLeft: "-50vw",
                marginRight: "-50vw",

                overflowX: "hidden",
            }}
        >
            {/* HERO */}
            <Box
                sx={{
                    background: `linear-gradient(
                        145deg,
                        ${TEAL_DARK} 0%,
                        ${TEAL_MID} 55%,
                        ${TEAL} 100%
                    )`,
                    pt: { xs: 5, md: 7 },
                    pb: { xs: 6, md: 8 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decoración */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -80,
                        right: -80,
                        width: 320,
                        height: 320,
                        borderRadius: "50%",
                        background: "rgba(15,118,110,0.18)",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: -50,
                        left: -50,
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                    }}
                />

                <Container
                    maxWidth="lg"
                    sx={{
                        textAlign: "center",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/tutor/dashboard")}
                        sx={{
                            color: "rgba(255,255,255,0.7)",
                            textTransform: "none",
                            mb: 3,
                        }}
                    >
                        Volver al dashboard
                    </Button>

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: "#fff",
                            mb: 1,
                        }}
                    >
                        Mis Cursos
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.75)",
                            fontSize: "1.1rem",
                            mb: 1,
                        }}
                    >
                        Gestiona y da seguimiento a todos tus cursos
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.65)",
                            mb: 4,
                        }}
                    >
                        {courses.length} cursos creados
                    </Typography>

                    <Button
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/tutor/courses/create")
                        }
                        sx={{
                            backgroundColor: "#f59e0b",
                            color: "#000",
                            px: 4,
                            py: 1.6,
                            borderRadius: 3,
                            fontWeight: 700,
                            fontSize: "1rem",

                            "&:hover": {
                                backgroundColor: "#d97706",
                            },
                        }}
                    >
                        Crear nuevo curso
                    </Button>
                </Container>
            </Box>

            {/* LISTA */}
            <Container
                maxWidth="lg"
                sx={{
                    py: 6,
                }}
            >
                {courses.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                        }}
                    >
                        <Typography variant="h6">
                            No tienes cursos creados todavía.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {courses.map((course) => {
                            const status = getStatusColor(
                                course.status
                            );

                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    key={course.id}
                                >
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            height: "100%",

                                            border:
                                                "1px solid #e2e8f0",

                                            transition:
                                                "all 0.25s ease",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-6px)",

                                                boxShadow:
                                                    "0 16px 40px rgba(15,118,110,0.15)",
                                            },
                                        }}
                                    >
                                        {/* Header */}
                                        <Box
                                            sx={{
                                                height: 180,

                                                background: `linear-gradient(
                                                    145deg,
                                                    ${TEAL_DARK},
                                                    ${TEAL}
                                                )`,

                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            <SchoolIcon
                                                sx={{
                                                    fontSize: 70,
                                                    color: "#fff",
                                                }}
                                            />
                                        </Box>

                                        <CardContent>
                                            <Chip
                                                label={
                                                    status.label
                                                }
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        status.bg,

                                                    color:
                                                        status.color,

                                                    fontWeight: 700,

                                                    mb: 2,
                                                }}
                                            />

                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 800,
                                                    color:
                                                        TEAL_DARK,
                                                    mb: 1,
                                                }}
                                            >
                                                {course.title}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color:
                                                        "#64748b",
                                                    minHeight: 50,
                                                    mb: 2,
                                                }}
                                            >
                                                {course.description ||
                                                    "Sin descripción disponible"}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize:
                                                        "0.8rem",
                                                    color:
                                                        "#94a3b8",
                                                    mb: 2,
                                                }}
                                            >
                                                ID #{course.id}
                                            </Typography>

                                            <Button
                                                fullWidth
                                                startIcon={
                                                    <EditIcon />
                                                }
                                                variant="contained"
                                                sx={{
                                                    backgroundColor:
                                                        TEAL,

                                                    textTransform:
                                                        "none",

                                                    fontWeight: 700,

                                                    borderRadius: 3,

                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                TEAL_MID,
                                                        },
                                                }}
                                            >
                                                Gestionar curso
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default TutorCourses;