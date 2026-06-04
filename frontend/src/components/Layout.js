import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

const navItems = {
  estudiante: [
    { to: '/student', label: '🏠 Inicio' },
    { to: '/student/courses', label: '📚 Mis Cursos' },
    { to: '/student/catalog', label: '🔍 Catálogo' },
    { to: '/student/profile', label: '👤 Perfil' },
  ],
  tutor: [
    { to: '/tutor', label: '🏠 Inicio' },
    { to: '/tutor/courses', label: '📚 Mis Cursos' },
    { to: '/tutor/courses/new', label: '➕ Nuevo Curso' },
    { to: '/tutor/profile', label: '👤 Perfil' },
  ],
  admin: [
    { to: '/admin', label: '🏠 Dashboard' },
    { to: '/admin/courses', label: '📚 Cursos' },
    { to: '/admin/users', label: '👥 Usuarios' },
    { to: '/admin/profile', label: '👤 Perfil' },
  ],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItems[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>📚</span>
          <span className={styles.brandName}>CMS</span>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.nombre?.[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.userName}>{user?.nombre}</div>
            <div className={styles.userRole}>{user?.role}</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {items.map(item => (
            <Link key={item.to} to={item.to}
              className={`${styles.navItem} ${location.pathname === item.to ? styles.active : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className={styles.logout} onClick={handleLogout}>🚪 Cerrar Sesión</button>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
