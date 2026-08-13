import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, allowedRole, requireStaff }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requireStaff && !user.is_staff) {
        return <Navigate to="/" />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;