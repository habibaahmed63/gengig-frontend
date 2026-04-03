import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Attach token to EVERY request automatically ──
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // read fresh every time
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Handle 401 globally — auto logout if token expires ──
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

export default api;