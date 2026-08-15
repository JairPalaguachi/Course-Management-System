import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatDate, formatDuration, getLevelLabel } from "./courseUtils";
import CourseMetaItem from "./CourseMetaItem";

const TEAL = "#0f766e";

function EnrollAction({ canEnroll, isEnrolled, enrolling, onEnroll, course }) {
    if (isEnrolled) {
        return (
            <Button
                variant="contained"
                disabled
                startIcon={<CheckCircleIcon />}
                sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 3,
                    "&.Mui-disabled": {
                        backgroundColor: "#bbf7d0",
                        color: "#166534",
                    },
                }}
            >
                Ya inscrito
            </Button>
        );
    }

    if (!canEnroll) {
        return null;
    }

    return (
        <Button
            variant="contained"
            onClick={() => onEnroll(course)}
            disabled={enrolling}
            startIcon={
                enrolling ? <CircularProgress size={16} color="inherit" /> : <AddCircleOutlineIcon />
            }
            sx={{
                backgroundColor: "#f59e0b",
                color: "#1c1917",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 3,
                px: 2.5,
                "&:hover": { backgroundColor: "#d97706" },
            }}
        >
            {enrolling ? "Inscribiendo..." : "Inscribirse"}
        </Button>
    );
}

EnrollAction.propTypes = {
    canEnroll: PropTypes.bool.isRequired,
    course: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
    }).isRequired,
    enrolling: PropTypes.bool.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    onEnroll: PropTypes.func,
};

function CourseDetailDialog({
    course,
    open,
    onClose,
    canEnroll = false,
    isEnrolled = false,
    enrolling = false,
    onEnroll = null,
}) {
    if (!course) {
        return null;
    }

    const showEnrollAction = Boolean(onEnroll) && (canEnroll || isEnrolled);

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
                        <CourseMetaItem icon={<SchoolIcon sx={{ fontSize: 18, color: TEAL }} />}>
                            Tutor: {course.tutor_username || "Equipo académico"}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<TrendingUpIcon sx={{ fontSize: 18, color: TEAL }} />}>
                            Nivel: {getLevelLabel(course.level)}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<AccessTimeIcon sx={{ fontSize: 18, color: TEAL }} />}>
                            Duración: {formatDuration(course.duration_minutes)}
                        </CourseMetaItem>
                        <CourseMetaItem icon={<VerifiedIcon sx={{ fontSize: 18, color: TEAL }} />}>
                            Publicado: {formatDate(course.published_at || course.created_at)}
                        </CourseMetaItem>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
                    Cerrar
                </Button>
                {showEnrollAction ? (
                    <EnrollAction
                        canEnroll={canEnroll}
                        course={course}
                        enrolling={enrolling}
                        isEnrolled={isEnrolled}
                        onEnroll={onEnroll}
                    />
                ) : null}
            </DialogActions>
        </Dialog>
    );
}

CourseDetailDialog.propTypes = {
    /** Habilita el botón "Inscribirse" (solo para usuarios con rol estudiante). */
    canEnroll: PropTypes.bool,
    course: PropTypes.shape({
        category_name: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        duration_minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        level: PropTypes.string,
        published_at: PropTypes.string,
        title: PropTypes.string.isRequired,
        tutor_username: PropTypes.string,
    }),
    /** Muestra el estado de carga mientras se procesa la inscripción. */
    enrolling: PropTypes.bool,
    /** El estudiante ya está inscrito en este curso. */
    isEnrolled: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    /** Callback que recibe el curso y abre la confirmación de inscripción. */
    onEnroll: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default CourseDetailDialog;
