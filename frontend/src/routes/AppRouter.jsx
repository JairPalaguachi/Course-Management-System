import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import StudentDashboard from "../pages/StudentDashboard";
import TutorDashboard from "../pages/TutorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import TutorRegister from "../pages/TutorRegister";
import StudentRegister from "../pages/StudentRegister";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                {/* dashboards por rol */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tutor/dashboard"
                    element={
                        <ProtectedRoute allowedRole="tutor">
                            <TutorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/register/tutor" element={<TutorRegister />}

                />

                <Route
                    path="/register/student"
                    element={<StudentRegister />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;