import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import CourseCard from '../../components/CourseCard';
import API from '../../api/client';
import styles from '../Dashboard.module.css';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [nivel, setNivel] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (nivel) params.set('nivel', nivel);
    if (categoria) params.set('categoria', categoria);
    API.get(`/courses/?${params}`).then(r => setCourses(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { API.get('/categories/').then(r => setCategories(r.data)); }, []);
  useEffect(() => { load(); }, [search, nivel, categoria]);

  const enroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await API.post(`/student/enroll/${courseId}/`);
      setMsg('✅ ¡Inscripción exitosa!');
    } catch(e) {
      setMsg('⚠️ ' + (e.response?.data?.error || 'Error al inscribirse'));
    } finally { setEnrolling(null); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Catálogo de Cursos</h1>
        {msg && <div className={styles.toast}>{msg}</div>}
        <div className={styles.filters}>
          <input className={styles.search} placeholder="🔍 Buscar cursos..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <select value={nivel} onChange={e => setNivel(e.target.value)}>
            <option value="">Todos los niveles</option>
            <option value="basico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        {loading ? <p>Cargando...</p> : courses.length === 0 ? (
          <div className={styles.empty}><p>No se encontraron cursos.</p></div>
        ) : (
          <div className={styles.grid}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} actions={
                <button className={styles.enrollBtn} disabled={enrolling === course.id}
                  onClick={() => enroll(course.id)}>
                  {enrolling === course.id ? 'Inscribiendo...' : '+ Inscribirse'}
                </button>
              } />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
