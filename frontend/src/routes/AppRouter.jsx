import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";

import StudentDashboard from "../pages/StudentDashboard";
import StudentHistory from "../pages/StudentHistory";
import StudentCourseDetail from "../pages/StudentCourseDetail";
import StudentRegister from "../pages/StudentRegister";

import TutorDashboard from "../pages/TutorDashboard";
import TutorRegister from "../pages/TutorRegister";
import TutorCourseCreate from "../pages/TutorCourseCreate";
import TutorCourses from "../pages/TutorCourses";
import TutorCourseEdit from "../pages/TutorCourseEdit";

import AdminDashboard from "../pages/AdminDashboard";
import UserListPage from "../pages/admin/UserListPage";
import AdminCourseList from "../pages/admin/AdminCourseList";
import AdminCourseEdit from "../pages/admin/AdminCourseEdit";
import AdminCourseReview from "../pages/admin/AdminCourseReview";

import SuperUserUserManagement from "../pages/superuser/SuperUserUserManagement";


function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/history"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/courses/:courseId"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentCourseDetail />
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
                <Route path="/register/tutor" element={<TutorRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />

                <Route
                    path="/tutor/courses/create"
                    element={
                        <ProtectedRoute allowedRole="tutor">
                            <TutorCourseCreate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tutor/courses"
                    element={
                        <ProtectedRoute allowedRole="tutor">
                            <TutorCourses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tutor/courses/edit/:id"
                    element={
                        <ProtectedRoute allowedRole="tutor">
                            <TutorCourseEdit />
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
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <UserListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminCourseList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/edit/:id"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminCourseEdit />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/superuser/users"
                    element={
                        <ProtectedRoute requireStaff>
                            <SuperUserUserManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/courses/:id/review"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminCourseReview />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
