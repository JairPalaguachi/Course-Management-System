import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import Catalog from './pages/student/Catalog';
import TutorDashboard from './pages/tutor/TutorDashboard';
import CourseForm from './pages/tutor/CourseForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role === 'tutor' ? 'tutor' : 'student'}`} /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={<PrivateRoute roles={['estudiante']}><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/catalog" element={<PrivateRoute roles={['estudiante']}><Catalog /></PrivateRoute>} />
      <Route path="/student/courses" element={<PrivateRoute roles={['estudiante']}><StudentDashboard /></PrivateRoute>} />
      <Route path="/tutor" element={<PrivateRoute roles={['tutor','admin']}><TutorDashboard /></PrivateRoute>} />
      <Route path="/tutor/courses" element={<PrivateRoute roles={['tutor','admin']}><TutorDashboard /></PrivateRoute>} />
      <Route path="/tutor/courses/new" element={<PrivateRoute roles={['tutor','admin']}><CourseForm /></PrivateRoute>} />
      <Route path="/tutor/courses/:id/edit" element={<PrivateRoute roles={['tutor','admin']}><CourseForm /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/courses" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><UserList /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
