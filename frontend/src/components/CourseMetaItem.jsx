import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

function CourseMetaItem({ icon, children }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography sx={{ color: "#475569", fontSize: "0.92rem" }}>{children}</Typography>
        </Stack>
    );
}

CourseMetaItem.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.node.isRequired,
};

export default CourseMetaItem;