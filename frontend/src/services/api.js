// Centralized Frontend API Client
const getApiBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    envUrl = envUrl.trim().replace(/\/+$/, "");
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
  }
  return "http://localhost:5000/api";
};


export const getAuthToken = () => localStorage.getItem("mathquest_token");
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("mathquest_token", token);
  else localStorage.removeItem("mathquest_token");
};

let isOfflineMode = false;
export const getOfflineStatus = () => isOfflineMode;
export const setOfflineStatus = (status) => {
  isOfflineMode = status;
};

export const api = {
  request: async (endpoint, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    
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

      // Successful call - clear offline mode status if it was active
      if (isOfflineMode) {
        isOfflineMode = false;
      }

      return await response.json();
    } catch (err) {
      if (err instanceof TypeError && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
        if (!isOfflineMode) {
          console.warn("[API CLIENT] Express backend connection issue detected.");
          isOfflineMode = true;
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

