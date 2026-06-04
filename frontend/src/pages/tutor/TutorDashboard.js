import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import CourseCard from '../../components/CourseCard';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from '../Dashboard.module.css';

export default function TutorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/tutor/courses/').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const publish = async (id) => {
    await API.post(`/tutor/courses/${id}/publish/`);
    API.get('/tutor/courses/').then(r => setCourses(r.data));
  };

  const stats = { total: courses.length, publicados: courses.filter(c=>c.estado==='publicado').length, pendientes: courses.filter(c=>c.estado==='pendiente').length, borradores: courses.filter(c=>c.estado==='borrador').length };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.welcome}>
          <div><h1>¡Hola, {user?.nombre}! ✏️</h1><p>Gestiona y crea tus cursos</p></div>
          <Link to="/tutor/courses/new" className={styles.ctaBtn}>➕ Nuevo Curso</Link>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}><span className={styles.statNum}>{stats.total}</span><span>Total cursos</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#27ae60'}}>{stats.publicados}</span><span>Publicados</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#f39c12'}}>{stats.pendientes}</span><span>Pendientes</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{color:'#95a5a6'}}>{stats.borradores}</span><span>Borradores</span></div>
        </div>
        <h2 className={styles.sectionTitle}>Mis cursos</h2>
        {loading ? <p>Cargando...</p> : courses.length === 0 ? (
          <div className={styles.empty}><p>No tienes cursos aún.</p><Link to="/tutor/courses/new" className={styles.ctaBtn}>Crear primer curso</Link></div>
        ) : (
          <div className={styles.grid}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} actions={<>
                <Link to={`/tutor/courses/${course.id}/edit`} className={styles.btnSecondary}>✏️ Editar</Link>
                {(course.estado === 'borrador' || course.estado === 'rechazado') && (
                  <button className={styles.btnGreen} onClick={() => publish(course.id)}>🚀 Publicar</button>
                )}
              </>} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
