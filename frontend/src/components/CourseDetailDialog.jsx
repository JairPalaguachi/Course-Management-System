import PropTypes from "prop-types";
import { Box, Chip, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatDate, formatDuration, getLevelLabel } from "./courseUtils";
import CourseMetaItem from "./CourseMetaItem";

function CourseDetailDialog({ course, open, onClose }) {
    if (!course) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1 }}>
                <Stack spacing={1.5}>
                    <Chip
                        label={course.category_name || "Sin categoría"}
                        sx={{ alignSelf: "flex-start", fontWeight: 700 }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        {course.title}
                    </Typography>
                    <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
                        {course.description}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Divider sx={{ mb: 3 }} />
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor: "rgba(15,118,110,0.06)",
                        border: "1px solid rgba(15,118,110,0.12)",
                    }}
                >
                    <Stack spacing={1.5}>
                        <CourseMetaItem icon={<SchoolIcon sx={{ fontSize: 18, color: "#0f766e" }} />}>
                            Tutor: {course.tutor_username || "Equipo académico"}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<TrendingUpIcon sx={{ fontSize: 18, color: "#0f766e" }} />}>
                            Nivel: {getLevelLabel(course.level)}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<AccessTimeIcon sx={{ fontSize: 18, color: "#0f766e" }} />}>
                            Duración: {formatDuration(course.duration_minutes)}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<VerifiedIcon sx={{ fontSize: 18, color: "#0f766e" }} />}>
                            Publicado: {formatDate(course.published_at || course.created_at)}
                        </CourseMetaItem>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

CourseDetailDialog.propTypes = {
    course: PropTypes.shape({
        category_name: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        duration_minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        level: PropTypes.string,
        published_at: PropTypes.string,
        title: PropTypes.string.isRequired,
        tutor_username: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default CourseDetailDialog;