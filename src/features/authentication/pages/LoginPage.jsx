import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";


import logoPath from "../../../assets/logo.png"; // Correct the path for the image
import backgroundPath from "../../../assets/background.png"; // Correct the path for the image

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }), 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials.");
      }

      const data = await response.json();
      // Store token and role in localStorage
      localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.role); 

      // Call the onLogin function passed as a prop
      onLogin({ token: data.token, role: data.role });
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
      <img src={logoPath} alt="Millennium IT" className="logo" />
      <h2 className="login-heading">RMA Web Application</h2>
      <div className="login-box">
        <h3 className="login-title">LOG IN</h3>
        {error && <p className="error-message">{error}</p>} 
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />

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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>
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