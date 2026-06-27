import PropTypes from "prop-types";
import { Box, Button, Chip, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

function BasicFilters({
    level,
    durationKey,
    levelOptions,
    durationOptions,
    onLevelChange,
    onDurationChange,
    onReset,
}) {
    return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Nivel"
                        value={level}
                        onChange={(event) => onLevelChange(event.target.value)}
                    >
                        {levelOptions.map((option) => (
                            <MenuItem key={option.value || "all"} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Duración"
                        value={durationKey}
                        onChange={(event) => onDurationChange(event.target.value)}
                    >
                        {durationOptions.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ width: "100%" }}>
                        <Typography variant="overline" sx={{ color: "#64748b" }}>
                            Filtros básicos
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                            <Chip label={`Nivel: ${level || "Todos"}`} variant="outlined" />
                            <Chip label={`Duración: ${durationOptions.find((item) => item.key === durationKey)?.label || "Todas"}`} variant="outlined" />
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

            <Box>
                <Button
                    variant="text"
                    onClick={onReset}
                    sx={{
                        px: 0,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#0f766e",
                    }}
                >
                    Limpiar filtros
                </Button>
            </Box>
        </Stack>
    );
}

BasicFilters.propTypes = {
    durationKey: PropTypes.string.isRequired,
    durationOptions: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    level: PropTypes.string.isRequired,
    levelOptions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string,
        }),
    ).isRequired,
    onDurationChange: PropTypes.func.isRequired,
    onLevelChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};

export default BasicFilters;