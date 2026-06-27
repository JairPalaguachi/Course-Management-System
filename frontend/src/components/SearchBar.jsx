import PropTypes from "prop-types";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function SearchBar({
    value,
    onChange,
    placeholder = "Buscar...",
    label = "Buscar",
    onClear,
}) {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                fullWidth
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: onClear && value ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Limpiar búsqueda"
                                edge="end"
                                onClick={onClear}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    );
}

SearchBar.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
};

export default SearchBar;