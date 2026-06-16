import { Button } from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <h1>Dashboard Estudiante</h1>

            <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
            >
                Cerrar sesión
            </Button>
        </>
    );
}

export default StudentDashboard;