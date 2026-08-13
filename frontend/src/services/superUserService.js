import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('access')}`,
});

export const getSuperUserUsers = async (params = {}) => {
  const response = await axios.get(`${API_URL}/superuser/users/`, {
    headers: getAuthHeader(),
    params,
  });
  return response.data;
};

export const createSuperUserUser = async (data) => {
  const response = await axios.post(`${API_URL}/superuser/users/`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateSuperUserUser = async (id, data) => {
  const response = await axios.patch(`${API_URL}/superuser/users/${id}/`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteSuperUserUser = async (id) => {
  const response = await axios.delete(`${API_URL}/superuser/users/${id}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const setSuperUserUserPassword = async (id, data) => {
  const response = await axios.post(`${API_URL}/superuser/users/${id}/set-password/`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};