import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

// Import logo and background image
import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";

// Main LoginPage component
const LoginPage = ({ onLogin }) => {
  // State variables for form inputs and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook for navigating between pages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous error

    try {
      // Send login request to backend API
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }), // Send user input
      });

      // Handle failed login
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials.");
      }

      // Handle successful login
      const data = await response.json();
      localStorage.setItem("token", data.token);       // Save token to local storage
      localStorage.setItem("role", data.role);         // Save role
      localStorage.setItem("username", username);      // Save username
      onLogin({ token: data.token, role: data.role }); // Trigger parent login handler
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message); // Show error message to user
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      {/* Logo and app name */}
      <img src={logoPath} alt="Millennium IT" className="logo" />
      <h2 className="login-heading">RMA Web Application</h2>

      {/* Login form box */}
      <div className="login-box">
        <h3 className="login-title">LOG IN</h3>

        {/* Show error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Username input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />

          {/* Role dropdown */}
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Role</option>
            <option value="RMA">RMA</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPLYCHAIN">SUPPLYCHAIN</option>
            <option value="ENGINEER">ENGINEER</option>
          </select>

          {/* Password input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          {/* Forgot password link */}
          <div className="forgot-password">
            <span
              className="forgot-password-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit button */}
          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>

        {/* Link to sign up page */}
        <p className="signup-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
