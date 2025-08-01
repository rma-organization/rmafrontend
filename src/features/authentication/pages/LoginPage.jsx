import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "../styles/LoginPage.css";
import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";
import { loginUser } from "../../../services/api/authService";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Destructure data from axios response
      const { data } = await loginUser({ username, password, role });

      const decodedToken = jwtDecode(data.token);
      const decodedUsername = decodedToken.sub || username;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", decodedUsername);

      onLogin({ token: data.token, role: data.role });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials.");
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
