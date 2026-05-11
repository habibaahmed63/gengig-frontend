import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token"); if (token) {
            config.headers.Authorization = `Bearer ${getToken()}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

export default api;