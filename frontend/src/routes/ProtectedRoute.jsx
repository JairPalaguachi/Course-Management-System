import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, allowedRole, requireStaff }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requireStaff && !user.is_staff) {
        return <Navigate to="/" />;
    }

    if (allowedRole && user.role !== allowedRole && !user.is_staff) {
        return <Navigate to="/" />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRole: PropTypes.string,
    requireStaff: PropTypes.bool,
};

export default ProtectedRoute;