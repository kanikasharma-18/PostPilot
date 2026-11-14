import axios from "axios";

/**
 * Central Axios Instance for PostPilot DISU Platform
 * Configured with environment variables, timeouts, and error interceptors.
 */

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Attach Auth Token if present
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== "undefined" && typeof localStorage.getItem === "function") {
      const token = localStorage.getItem("postpilot_auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful handling of common HTTP statuses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response;
    const status = error.response?.status;

    if (isNetworkError) {
      // Backend not running or connection refused
      console.warn("[PostPilot API] Backend server unreachable. Falling back to demonstration data service.", error.message);
    } else if (status === 401) {
      console.warn("[PostPilot API] Unauthorized (401). Token expired or missing.");
    } else if (status === 404) {
      console.warn("[PostPilot API] Endpoint not found (404):", error.config?.url);
    } else if (status >= 500) {
      console.error("[PostPilot API] Server error (5xx):", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;
