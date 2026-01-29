// API base URL: from env at build time, or at runtime use production when not on localhost (e.g. Netlify)
export function getApiBase() {
    const fromEnv = import.meta.env.VITE_API_BASE;
    if (fromEnv) return fromEnv;
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return 'https://fortex-api.onrender.com';
    }
    return 'http://localhost:4000';
}
