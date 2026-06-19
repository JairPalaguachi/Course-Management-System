import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Obtiene el listado de usuarios registrados (solo administrador).
 * @param {string|null} role - Filtro opcional: 'estudiante' | 'tutor' | 'administrador'
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async (role = null) => {
  const token = localStorage.getItem("access_token");
  const params = role ? { role } : {};

  const response = await axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};
