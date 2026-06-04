import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import API from '../../api/client';
import styles from '../Dashboard.module.css';

export default function CourseForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo:'', descripcion:'', nivel:'basico', duracion_horas:0, categorias:[] });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/categories/').then(r => setCategories(r.data));
    if (isEdit) API.get(`/tutor/courses/${id}/`).then(r => {
      const c = r.data;
      setForm({ titulo:c.titulo, descripcion:c.descripcion, nivel:c.nivel, duracion_horas:c.duracion_horas, categorias:c.categorias });
    });
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (isEdit) await API.patch(`/tutor/courses/${id}/`, form);
      else await API.post('/tutor/courses/', form);
      navigate('/tutor/courses');
    } catch(err) {
      setError('Error al guardar el curso. Verifica los datos.');
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.formCard}>
          <h1 className={styles.pageTitle}>{isEdit ? '✏️ Editar Curso' : '➕ Nuevo Curso'}</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label>Título del curso *</label>
              <input value={form.titulo} required onChange={e=>setForm({...form,titulo:e.target.value})} placeholder="Ej: Python desde cero" />
            </div>
            <div className={styles.formField}>
              <label>Descripción *</label>
              <textarea rows={4} value={form.descripcion} required onChange={e=>setForm({...form,descripcion:e.target.value})} placeholder="Describe el contenido del curso..." />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Nivel</label>
                <select value={form.nivel} onChange={e=>setForm({...form,nivel:e.target.value})}>
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label>Duración (horas)</label>
                <input type="number" min="0" value={form.duracion_horas} onChange={e=>setForm({...form,duracion_horas:parseInt(e.target.value)||0})} />
              </div>
            </div>
            <div className={styles.formField}>
              <label>Categorías</label>
              <div className={styles.checkGroup}>
                {categories.map(c => (
                  <label key={c.id} className={styles.checkItem}>
                    <input type="checkbox" checked={form.categorias.includes(c.id)}
                      onChange={e => setForm({...form, categorias: e.target.checked ? [...form.categorias, c.id] : form.categorias.filter(x=>x!==c.id)})} />
                    {c.nombre}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnSecondary} onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className={styles.ctaBtn} disabled={loading}>{loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear curso'}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
