// src/services/axiosInstance.js
import axios from 'axios';

// Use Vite environment variable with fallback
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received: ", response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Server error: ", error.response.data);
      if (error.response.status === 401) {
        console.error("Unauthorized access - Redirecting to login...");
        // Add redirect logic if needed
      } else if (error.response.status === 500) {
        console.error("Internal server error");
      }
    } else if (error.request) {
      console.error("No response received: ", error.request);
    } else {
      console.error("Error during request setup: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
