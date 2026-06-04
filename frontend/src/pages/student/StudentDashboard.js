import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import CourseCard from '../../components/CourseCard';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from '../Dashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/student/enrollments/').then(r => setEnrollments(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.welcome}>
          <div>
            <h1>¡Bienvenido, {user?.nombre}! 👋</h1>
            <p>Continúa aprendiendo con tus cursos inscritos</p>
          </div>
          <Link to="/student/catalog" className={styles.ctaBtn}>🔍 Explorar cursos</Link>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}><span className={styles.statNum}>{enrollments.length}</span><span>Cursos inscritos</span></div>
          <div className={styles.stat}><span className={styles.statNum}>{enrollments.filter(e=>e.estado==='completado').length}</span><span>Completados</span></div>
          <div className={styles.stat}><span className={styles.statNum}>{enrollments.filter(e=>e.estado==='activo').length}</span><span>En progreso</span></div>
        </div>
        <h2 className={styles.sectionTitle}>Mis cursos recientes</h2>
        {loading ? <p>Cargando...</p> : enrollments.length === 0 ? (
          <div className={styles.empty}>
            <p>No estás inscrito en ningún curso aún.</p>
            <Link to="/student/catalog" className={styles.ctaBtn}>Explorar catálogo</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {enrollments.slice(0,3).map(e => (
              <CourseCard key={e.id} course={e.curso_info} to={`/student/courses/${e.curso}`} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
