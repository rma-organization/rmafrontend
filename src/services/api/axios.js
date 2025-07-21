import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Add token from localStorage to every request if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Function to search inventory by serial number
export const searchInventoryBySerial = async (serial) => {
  const response = await axiosInstance.get(`/api/inventory/search-by-serial`, {
    params: { serial },
  });
  return response.data; // returns inventory array
};

// Function to search parts by serial number
export const searchPartsBySerial = async (serial) => {
  const response = await axiosInstance.get(`/api/parts/search-by-serial`, {
    params: { serial },
  });
  return response.data; 
};

export default axiosInstance;