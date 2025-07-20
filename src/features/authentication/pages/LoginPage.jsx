import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // default import for jwt-decode v4
import "../styles/LoginPage.css";

// Import logo and background image
import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Workaround for Vite + jwt-decode default export interop
  const decodeJwt = jwtDecode.default || jwtDecode;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials.");
      }

      const data = await response.json();

      // Decode JWT token using the fixed decodeJwt function
      const decodedToken = decodeJwt(data.token);
      const decodedUsername = decodedToken.sub || username;

      // Save JWT token, role, and username in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", decodedUsername);

      // Notify parent component about successful login
      onLogin({ token: data.token, role: data.role });

      // Navigate to dashboard or other page after login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
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
      {/* Logo */}
      <img src={logoPath} alt="Millennium IT" className="logo" />
      <h2 className="login-heading">RMA Web Application</h2>

      <div className="login-box">
        <h3 className="login-title">LOG IN</h3>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />

          <select
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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          <div className="forgot-password">
            <span
              className="forgot-password-link"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
