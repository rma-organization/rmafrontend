// // src/api/axiosInstance.js
// import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

// const axiosInstance = axios.create({
//   baseURL: apiUrl,
//   headers: { "Content-Type": "application/json" },
// });

// // Automatically attach JWT token from localStorage to each request if present
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;

// // Example API functions (optional)
// export const searchInventoryBySerial = async (serial) => {
//   const response = await axiosInstance.get(`/api/inventory/search-by-serial`, { params: { serial } });
//   return response.data;
// };

// export const searchPartsBySerial = async (serial) => {
//   const response = await axiosInstance.get(`/api/parts/search-by-serial`, { params: { serial } });
//   return response.data;
// };

// src/api/axiosInstance.js
// import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

// const axiosInstance = axios.create({
//   baseURL: apiUrl,
//   // baseURL: 'http://localhost:8080/api',
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach JWT token automatically
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;

// src/services/api/axiosInstance.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token and Role header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (role) {
    config.headers.Role = role;
  }

  return config;
});

export default axiosInstance;


// Example API functions (optional)
export const searchInventoryBySerial = async (serial) => {
  const response = await axiosInstance.get(`/api/inventory/search-by-serial`, { params: { serial } });
  return response.data;
};

export const searchPartsBySerial = async (serial) => {
  const response = await axiosInstance.get(`/api/parts/search-by-serial`, { params: { serial } });
  return response.data;
};
