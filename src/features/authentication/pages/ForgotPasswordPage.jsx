// export default ForgotPasswordPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";
import { forgotPassword } from "../../../services/api/authService";

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await forgotPassword({ username, email });
      setMessage(data.message || "Password reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to request password reset.");
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
        <h3 className="login-title">FORGOT PASSWORD</h3>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="login-button">
            RESET
          </button>
        </form>

        <p className="signup-text">
          Back to{" "}
          <span className="signup-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
