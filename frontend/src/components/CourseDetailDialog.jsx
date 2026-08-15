import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { formatDate, formatDuration, getLevelLabel } from "./courseUtils";
import CourseMetaItem from "./CourseMetaItem";

function CourseDetailDialog({ course, open, onClose }) {
    if (!course) {
        return null;
    }

    const duration = course.duration ?? course.duration_minutes;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            {/* Imagen */}
            <Box
                sx={{
                    height: { xs: 180, sm: 260 },
                    width: "100%",
                    backgroundColor: "#e2e8f0",
                    backgroundImage: course.cover_image
                        ? `url(${course.cover_image})`
                        : "linear-gradient(145deg, #0a2e2b, #0f766e)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {!course.cover_image && (
                    <AutoStoriesIcon
                        sx={{
                            fontSize: 80,
                            color: "#ffffff",
                            opacity: 0.85,
                        }}
                    />
                )}
            </Box>

            <DialogTitle sx={{ pb: 1 }}>
                <Stack spacing={1.5}>
                    <Chip
                        label={course.category_name || "Sin categoría"}
                        sx={{
                            alignSelf: "flex-start",
                            fontWeight: 700,
                            backgroundColor: "rgba(15,118,110,0.12)",
                            color: "#0f766e",
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                        }}
                    >
                        {course.title}
                    </Typography>

                    <Typography
                        sx={{
                            color: "#475569",
                            lineHeight: 1.7,
                        }}
                    >
                        {course.description ||
                            "Sin descripción disponible."}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Divider sx={{ mb: 3 }} />

                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor:
                            "rgba(15,118,110,0.06)",
                        border:
                            "1px solid rgba(15,118,110,0.12)",
                    }}
                >
                    <Stack spacing={1.5}>
                        <CourseMetaItem
                            icon={
                                <SchoolIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "#0f766e",
                                    }}
                                />
                            }
                        >
                            Tutor:{" "}
                            {course.tutor_username ||
                                "Equipo académico"}
                        </CourseMetaItem>

                        <CourseMetaItem
                            icon={
                                <TrendingUpIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "#0f766e",
                                    }}
                                />
                            }
                        >
                            Nivel: {getLevelLabel(course.level)}
                        </CourseMetaItem>

                        <CourseMetaItem
                            icon={
                                <AccessTimeIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "#0f766e",
                                    }}
                                />
                            }
                        >
                            Duración: {formatDuration(duration)}
                        </CourseMetaItem>

                        <CourseMetaItem
                            icon={
                                <VerifiedIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "#0f766e",
                                    }}
                                />
                            }
                        >
                            Publicado:{" "}
                            {formatDate(
                                course.published_at ||
                                    course.created_at
                            )}
                        </CourseMetaItem>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    startIcon={<CloseIcon />}
                    variant="outlined"
                    sx={{
                        borderColor: "#0f766e",
                        color: "#0f766e",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 3,
                        px: 3,
                        "&:hover": {
                            borderColor: "#115e59",
                            backgroundColor:
                                "rgba(15,118,110,0.06)",
                        },
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

CourseDetailDialog.propTypes = {
    course: PropTypes.shape({
        category_name: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        duration: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        duration_minutes: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        level: PropTypes.string,
        published_at: PropTypes.string,
        title: PropTypes.string.isRequired,
        tutor_username: PropTypes.string,
        cover_image: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default CourseDetailDialog;