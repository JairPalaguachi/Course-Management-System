import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login/', form);
      login(data.access, data.refresh);
      const role = JSON.parse(atob(data.access.split('.')[1])).role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'tutor') navigate('/tutor');
      else navigate('/student');
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>📚</div>
        <h1 className={styles.title}>Course Management System</h1>
        <h2 className={styles.subtitle}>Iniciar Sesión</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} required
              onChange={e => setForm({...form, email: e.target.value})} placeholder="tu@email.com" />
          </div>
          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" value={form.password} required
              onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button className={styles.btn} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className={styles.link}>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </div>
    </div>
  );
}
