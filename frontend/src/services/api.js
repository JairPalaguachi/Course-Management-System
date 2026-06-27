import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    const requestUrl = config.url ?? "";

    // No enviar token al login
    if (
        token &&
        !requestUrl.includes("/auth/login/")
    ) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export default api;