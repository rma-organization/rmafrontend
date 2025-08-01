// export default ResetPasswordPage;
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";
import { resetPassword } from "../../../services/api/authService";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await resetPassword({ token, newPassword });
      setMessage(data.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password.");
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
        <h3 className="login-title">RESET PASSWORD</h3>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="login-button">
            RESET PASSWORD
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

export default ResetPasswordPage;
