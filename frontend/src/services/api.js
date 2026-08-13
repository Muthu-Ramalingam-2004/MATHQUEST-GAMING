// Centralized Frontend API Client with Resilient Local Fallback
const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = `${API_ROOT}/api`;

export const getAuthToken = () => localStorage.getItem("mathquest_token");
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("mathquest_token", token);
  else localStorage.removeItem("mathquest_token");
};

// Check if Express backend is running and reachable
let isOfflineMode = false;
export const getOfflineStatus = () => isOfflineMode;
export const setOfflineStatus = (status) => {
  isOfflineMode = status;
};

export const api = {
  request: async (endpoint, options = {}) => {
    // If we've already detected the backend is offline, bypass network call immediately
    if (isOfflineMode) {
      throw new TypeError("Offline mode bypass");
    }

    const url = `${BASE_URL}${endpoint}`;
    
    // Add default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };

    // Inject JWT Token if available
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Handle standard API errors
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          setAuthToken(null);
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      // Catch connection errors and trigger offline mode
      if (err instanceof TypeError && (err.message.includes("Failed to fetch") || err.message.includes("Offline mode bypass") || err.message.includes("NetworkError"))) {
        if (!isOfflineMode) {
          console.warn("[API CLIENT] Express backend is unreachable. Switching to offline LocalStorage simulation.");
          isOfflineMode = true;
          // Notify the UI using custom event so context can alert the user
          window.dispatchEvent(new CustomEvent("api-offline-triggered"));
        }
      }
      throw err;
    }
  },

  get: (endpoint, headers = {}) => api.request(endpoint, { method: "GET", headers }),
  post: (endpoint, body, headers = {}) => api.request(endpoint, { method: "POST", headers, body: JSON.stringify(body) }),
  put: (endpoint, body, headers = {}) => api.request(endpoint, { method: "PUT", headers, body: JSON.stringify(body) }),
  delete: (endpoint, headers = {}) => api.request(endpoint, { method: "DELETE", headers })
};
