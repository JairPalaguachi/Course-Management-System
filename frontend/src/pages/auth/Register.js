import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/client';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ email:'', nombre:'', apellido:'', password:'', role:'estudiante' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await API.post('/auth/register/', form);
      navigate('/login?registered=1');
    } catch(err) {
      setError(err.response?.data?.email?.[0] || 'Error al registrarse. Intenta de nuevo.');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>📚</div>
        <h1 className={styles.title}>Course Management System</h1>
        <h2 className={styles.subtitle}>Crear Cuenta</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={form.nombre} required onChange={e => setForm({...form,nombre:e.target.value})} placeholder="Juan" />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <input value={form.apellido} required onChange={e => setForm({...form,apellido:e.target.value})} placeholder="Pérez" />
            </div>
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} required onChange={e => setForm({...form,email:e.target.value})} placeholder="tu@email.com" />
          </div>
          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" value={form.password} required minLength={8} onChange={e => setForm({...form,password:e.target.value})} placeholder="Mínimo 8 caracteres" />
          </div>
          <div className={styles.field}>
            <label>Tipo de cuenta</label>
            <select value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
              <option value="estudiante">Estudiante</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          <button className={styles.btn} disabled={loading}>{loading ? 'Creando...' : 'Crear Cuenta'}</button>
        </form>
        <p className={styles.link}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
