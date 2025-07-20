// Import navigation hook
import { useNavigate } from "react-router-dom";

// Logout button component
const LogoutButton = () => {
  const navigate = useNavigate();

  // Clear session data and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Render logout button
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;