import PropTypes from "prop-types";
import { Box, Card, CardContent, Chip, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getLevelLabel } from "./courseUtils";

function CourseCard({ course, onClick }) {
    return (
        <Card
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "430",
                display: "flex",
                flexDirection: "column",
                maxWidth: 260,
                width: "100%",
                margin: "0 auto",
                border: "1px solid #e2e8f0",
                transition: "all 0.25s ease",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,118,110,0.15)",
                },
            }}
        >
            {/* Imagen */}
            <Box
                sx={{
                    height: 150,
                    width: "100%",
                    overflow: "hidden",
                    background: course.cover_image
                        ? "#f8fafc"
                        : "linear-gradient(145deg, #0a2e2b, #0f766e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                }}
            >
                {course.cover_image && (
                    <Box
                        component="img"
                        src={course.cover_image}
                        alt={course.title || "Portada del curso"}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            objectPosition: "center",
                            display: "block",
                            borderRadius: 2,
                            backgroundColor: "#f8fafc",
                        }}
                    />
                )}
            </Box>

            {/* Contenido */}
            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2.5,
                }}
            >
                {/* Nivel */}
                <Chip
                    label={getLevelLabel(course.level)}
                    size="small"
                    sx={{
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 600,
                        mb: 1.5,
                        alignSelf: "flex-start",
                        fontSize: "0.75rem",
                    }}
                />

                {/* Título */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#0a2e2b",
                        mb: 0.75,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 52,
                        fontSize: "0.95rem",
                    }}
                >
                    {course.title}
                </Typography>

                {/* Descripción */}
                <Typography
                    sx={{
                        color: "#64748b",
                        fontSize: "0.82rem",
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 38,
                    }}
                >
                    {course.description || "Sin descripción disponible."}
                </Typography>

                {/* Único botón público */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={(event) => {
                        event.stopPropagation();
                        onClick?.();
                    }}
                    sx={{
                        mt: "auto",
                        borderColor: "#0f766e",
                        color: "#0f766e",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 3,

                        "&:hover": {
                            backgroundColor: "rgba(15,118,110,0.06)",
                            borderColor: "#0f766e",
                        },
                    }}
                >
                    Ver más
                </Button>
            </CardContent>
        </Card>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        cover_image: PropTypes.string,
        description: PropTypes.string,
        level: PropTypes.string,
        title: PropTypes.string.isRequired,
    }).isRequired,

    onClick: PropTypes.func,
};

export default CourseCard;