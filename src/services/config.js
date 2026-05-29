const rawApiUrl = import.meta.env.VITE_API_URL;

// In local development, force requests through Vite proxy to avoid browser CORS.
export const API_BASE_URL = (
  import.meta.env.DEV
    ? "/api"
    : rawApiUrl || "https://gengig-backend.vercel.app"
).replace(/\/+$/, "");
