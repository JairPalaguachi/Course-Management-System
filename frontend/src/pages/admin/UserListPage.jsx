import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";

const ROLES = [
  { value: "", label: "Todos los roles" },
  { value: "estudiante", label: "Estudiante" },
  { value: "tutor", label: "Tutor" },
  { value: "administrador", label: "Administrador" },
];

const BADGE = {
  estudiante: "badge-blue",
  tutor: "badge-purple",
  administrador: "badge-green",
};

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers(roleFilter || null);
        setUsers(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Error al cargar los usuarios. Intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  return (
    <div className="user-list-page">
      <div className="page-header">
        <h1>Usuarios registrados</h1>
        <p className="subtitle">
          {users.length} usuario{users.length !== 1 ? "s" : ""} encontrado
          {users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtro por rol */}
      <div className="filters">
        <label htmlFor="role-filter">Filtrar por rol:</label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="state-feedback loading" role="status">
          Cargando usuarios...
        </div>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <div className="state-feedback error" role="alert">
          {error}
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <div className="state-feedback empty">
              No se encontraron usuarios{roleFilter ? ` con rol "${roleFilter}"` : ""}.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${BADGE[user.role] || ""}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.is_active ? "badge-green" : "badge-gray"
                          }`}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
