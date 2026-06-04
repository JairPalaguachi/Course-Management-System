import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        const { data } = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh });
        localStorage.setItem('access', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;
