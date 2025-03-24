import axios from 'axios';

// Set up the base URL for API requests
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";  // Default to localhost if not set

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify response before passing it to components
    console.log("Response received: ", response); // Debug response details
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Server error: ", error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized error
        console.error("Unauthorized access - Redirecting to login...");
        // You can redirect the user to login page here if needed
      } else if (error.response.status === 500) {
        // Handle internal server error
        console.error("Internal server error");
      }
    } else if (error.request) {
      // No response was received
      console.error("No response received: ", error.request);
    } else {
      // Something happened while setting up the request
      console.error("Error during request setup: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;