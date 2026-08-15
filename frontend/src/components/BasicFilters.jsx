import PropTypes from "prop-types";
import {
    Box,
    Button,
    Chip,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

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
            {/* ── Título ─────────────────────────────────────────────── */}
            <Typography
                variant="overline"
                sx={{
                    color: "#64748b",
                    fontSize: "1rem",
                }}
            >
                FILTROS BÁSICOS
            </Typography>

            {/* ── Resumen de filtros seleccionados ───────────────────── */}
            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
            >
                <Chip
                    label={`Nivel: ${
                        level
                            ? levelOptions.find(
                                  (option) => option.value === level
                              )?.label || level
                            : "Todos"
                    }`}
                    variant="outlined"
                />

                <Chip
                    label={`Duración: ${
                        durationOptions.find(
                            (item) => item.key === durationKey
                        )?.label || "Todas"
                    }`}
                    variant="outlined"
                />
            </Stack>

            {/* ── Selectores ─────────────────────────────────────────── */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                {/* ── Filtro de Nivel ──────────────────────────────── */}
                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 280,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: "0.9rem",
                            mb: 0.5,
                        }}
                    >
                        Nivel
                    </Typography>

                    <TextField
    select
    fullWidth
    value={level || "__all__"}
    onChange={(event) => {
        const value = event.target.value;
        onLevelChange(value === "__all__" ? "" : value);
    }}
    SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => {
            if (selected === "__all__") {
                return "Todos los niveles";
            }

            return (
                levelOptions.find(
                    (option) => option.value === selected
                )?.label || "Todos los niveles"
            );
        },
    }}
>
    {levelOptions.map((option) => (
        <MenuItem
            key={option.value || "all"}
            value={option.value || "__all__"}
        >
            {option.label}
        </MenuItem>
    ))}
</TextField>
                </Box>

                {/* ── Filtro de Duración ────────────────────────────── */}
                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 280,
                        },
                    }}
                >
                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: "0.9rem",
                            mb: 0.5,
                        }}
                    >
                        Duración
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        value={durationKey}
                        onChange={(event) =>
                            onDurationChange(event.target.value)
                        }
                    >
                        {durationOptions.map((option) => (
                            <MenuItem
                                key={option.key}
                                value={option.key}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            {/* ── Limpiar filtros ────────────────────────────────────── */}
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
        })
    ).isRequired,

    level: PropTypes.string.isRequired,

    levelOptions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string,
        })
    ).isRequired,

    onDurationChange: PropTypes.func.isRequired,
    onLevelChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
};

export default BasicFilters;