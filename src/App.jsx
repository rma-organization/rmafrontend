import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./features/authentication/pages/SplashScreen";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import AdminHomePage from "./features/admin/AdminHomePage";
import AddNewInventory from "./features/supplychain/pages/AddNewInventory";
import RMAHomePage from "./features/rma/pages/RMAHomePage";
import EngineerHomePage from './features/engineer/pages/EngineerHomePage'; 

import ProtectedRoute from "./features/authentication/pages/ProtectedRoute";
import ErrorBoundary from "./features/authentication/pages/ErrorBoundary";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      console.log("Restoring User:", { token: storedToken, role: storedRole });
      setUser({ token: storedToken, role: storedRole });
    }
  }, []);

  const handleLogin = (loginData) => {
    const { token, role } = loginData;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ role, token });

    // Navigate based on the user's role
    switch (role) {
      case "RMA":
        navigate("/rma-home");
        break;
      case "ADMIN":
        navigate("/admin-home");
        break;
      case "SUPPLYCHAIN":
        navigate("/add-inventory");
        break;
      case "ENGINEER":
        navigate("/engineer-home");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-container">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/admin-home" element={<AdminHomePage />} />
              <Route path="/engineer-home" element={<EngineerHomePage />} />
              <Route path="/rma-home" element={<RMAHomePage />} />
              <Route path="/add-inventory" element={<AddNewInventory />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;
