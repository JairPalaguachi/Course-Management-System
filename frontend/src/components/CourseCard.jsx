import PropTypes from "prop-types";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatDate, formatDuration, getLevelLabel } from "./courseUtils";
import CourseMetaItem from "./CourseMetaItem";

function CourseCard({ course, onClick }) {
    return (
        <Card
            variant="outlined"
            onClick={onClick}
            sx={{
                height: "100%",
                borderRadius: 4,
                borderColor: "rgba(15,118,110,0.16)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,252,251,0.98) 100%)",
                boxShadow: "0 12px 40px rgba(15,118,110,0.08)",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": onClick
                    ? {
                          boxShadow: "0 16px 48px rgba(15,118,110,0.14)",
                          transform: "translateY(-3px)",
                      }
                    : {},
            }}
        >
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Chip
                        label={course.category_name || "Sin categoría"}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(15,118,110,0.12)",
                            color: "#0f766e",
                            fontWeight: 700,
                        }}
                    />
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={formatDuration(course.duration_minutes)}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                </Stack>

                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                        {course.title}
                    </Typography>
                    <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>{course.description}</Typography>
                </Box>

                <Stack spacing={1.25} sx={{ mt: "auto" }}>
                    <CourseMetaItem
                        icon={<SchoolIcon sx={{ fontSize: 18, color: "#0f766e" }} />}
                    >
                        Tutor: {course.tutor_username || "Equipo académico"}
                    </CourseMetaItem>
                    <CourseMetaItem
                        icon={<TrendingUpIcon sx={{ fontSize: 18, color: "#0f766e" }} />}
                    >
                        Nivel: {getLevelLabel(course.level)}
                    </CourseMetaItem>
                    <CourseMetaItem
                        icon={<VerifiedIcon sx={{ fontSize: 18, color: "#0f766e" }} />}
                    >
                        Publicado: {formatDate(course.published_at || course.created_at)}
                    </CourseMetaItem>
                </Stack>
            </CardContent>
        </Card>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        category_name: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        duration_minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        level: PropTypes.string,
        published_at: PropTypes.string,
        title: PropTypes.string.isRequired,
        tutor_username: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
};

export default CourseCard;