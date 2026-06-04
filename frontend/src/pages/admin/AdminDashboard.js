import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from '../Dashboard.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses:0, pending:0, users:0, published:0 });
  const [pendingCourses, setPendingCourses] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/admin/courses/'),
      API.get('/admin/courses/?estado=pendiente'),
      API.get('/admin/users/'),
    ]).then(([courses, pending, users]) => {
      setStats({
        courses: courses.data.length,
        pending: pending.data.length,
        users: users.data.length,
        published: courses.data.filter(c=>c.estado==='publicado').length,
      });
      setPendingCourses(pending.data.slice(0,5));
    });
  }, []);

  const approve = async (id, action) => {
    await API.post(`/admin/courses/${id}/approve/`, { action });
    const { data } = await API.get('/admin/courses/?estado=pendiente');
    setPendingCourses(data.slice(0,5));
    setStats(s => ({...s, pending: data.length}));
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.welcome}>
          <div><h1>Panel Administrativo 🛡️</h1><p>Bienvenido, {user?.nombre}</p></div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}><span className={styles.statNum}>{stats.courses}</span><span>Total cursos</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#27ae60'}}>{stats.published}</span><span>Publicados</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#f39c12'}}>{stats.pending}</span><span>Pendientes</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#2e6da4'}}>{stats.users}</span><span>Usuarios</span></div>
        </div>

        <h2 className={styles.sectionTitle}>⏳ Cursos pendientes de aprobación</h2>
        {pendingCourses.length === 0 ? (
          <div className={styles.empty}><p>No hay cursos pendientes ✅</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Curso</th><th>Tutor</th><th>Nivel</th><th>Acciones</th></tr></thead>
              <tbody>
                {pendingCourses.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.titulo}</strong></td>
                    <td>{c.tutor_info?.full_name}</td>
                    <td><span className={styles.badge}>{c.nivel}</span></td>
                    <td>
                      <button className={styles.btnGreen} onClick={() => approve(c.id,'aprobar')}>✅ Aprobar</button>
                      <button className={styles.btnRed} onClick={() => approve(c.id,'rechazar')}>❌ Rechazar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
