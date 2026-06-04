import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/client';
import styles from '../Dashboard.module.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (role='') => {
    setLoading(true);
    API.get(`/admin/users/${role ? `?role=${role}` : ''}`)
      .then(r => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const roleColor = { admin:'#e74c3c', tutor:'#2e6da4', estudiante:'#27ae60' };

  return (
    <Layout>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>👥 Usuarios Registrados</h1>
        <div className={styles.filters}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Todos los roles</option>
            <option value="estudiante">Estudiantes</option>
            <option value="tutor">Tutores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
        {loading ? <p>Cargando...</p> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th><th>Estado</th></tr></thead>
              <tbody>
                {users.map((u,i) => (
                  <tr key={u.id}>
                    <td>{i+1}</td>
                    <td><strong>{u.full_name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={styles.roleBadge} style={{background: roleColor[u.role]||'#888'}}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString('es-EC')}</td>
                    <td><span className={u.activo ? styles.active : styles.inactive}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
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
