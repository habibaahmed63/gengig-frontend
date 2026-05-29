const rawApiUrl = import.meta.env.VITE_API_URL;
const useSameOriginApi = import.meta.env.VITE_USE_SAME_ORIGIN_API !== "false";

// In local development, force requests through Vite proxy.
// In production, default to same-origin /api so Vercel can reverse-proxy to backend
// without browser-side CORS/preflight overhead.
export const API_BASE_URL = (
  import.meta.env.DEV
    ? "/api"
    : (useSameOriginApi ? "/api" : rawApiUrl || "/api")
).replace(/\/+$/, "");
