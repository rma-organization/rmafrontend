// // src/services/axiosInstance.js
// import axios from "axios";

// // Use Vite environment variable with fallback
// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

// const axiosInstance = axios.create({
//   baseURL: apiUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Attach the token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Optional: handle common error responses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized - possibly invalid or expired token.");
//     } else if (error.response?.status === 403) {
//       console.warn("Forbidden - not allowed to access this resource.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// src/services/axiosInstance.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Make sure you store token here after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - invalid or expired token.");
    } else if (error.response?.status === 403) {
      console.warn("Forbidden - access denied.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



