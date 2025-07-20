import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUsers, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/SignUpPage.css";

import logoPath from "../../../assets/logo.png";
import backgroundPath from "../../../assets/background.png";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: [],
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const ROLES = ["RMA", "ENGINEER", "SUPPLYCHAIN", "ADMIN"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let updatedRoles = [...formData.role];
      if (checked) {
        updatedRoles.push(value);
      } else {
        updatedRoles = updatedRoles.filter((role) => role !== value);
      }
      setFormData((prev) => ({ ...prev, role: updatedRoles }));
      setErrors((prev) => ({ ...prev, role: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = "Username is required!";
    if (!formData.email.trim()) tempErrors.email = "Email is required!";
    if (!formData.password) {
      tempErrors.password = "Password is required!";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.role.length === 0) tempErrors.role = "Please select at least one role!";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiURL = "http://localhost:8080/api/auth/register";

    try {
      // Optional pre-flight check
      const testResponse = await fetch(apiURL, { method: "OPTIONS" });
      if (!testResponse.ok) {
        throw new Error(`Server not reachable. Status: ${testResponse.status}`);
      }

      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roles: formData.role,
        }),
      });

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Signup failed. Please try again."}`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="signup-box">
        <img src={logoPath} alt="Millennium IT" className="logo" />
        <h2 className="signup-heading">RMA Web Application</h2>

        <h3 className="signup-title">SIGN UP</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            {errors.username && <small className="error-text">{errors.username}</small>}
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          {/* Password Field with Toggle */}
          <div className="input-group" style={{ position: "relative" }}>
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>

          <div className="input-group role-checkboxes">
            <FaUsers className="icon" />
            <div className="checkbox-group">
              {ROLES.map((role) => (
                <label key={role} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="role"
                    value={role}
                    checked={formData.role.includes(role)}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom">
                    {formData.role.includes(role) && <FaCheck />}
                  </span>
                  <span className="checkbox-text">{role}</span>
                </label>
              ))}
            </div>
            {errors.role && <small className="error-text">{errors.role}</small>}
          </div>

          <button type="submit" className="signup-button">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
