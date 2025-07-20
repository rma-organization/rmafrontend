import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SplashScreen from "./features/authentication/pages/SplashScreen";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import ResetPasswordPage from "./features/authentication/pages/ResetPasswordPage";
import ForgotPasswordPage from "./features/authentication/pages/ForgotPasswordPage";

import AdminHomePage from "./features/admin/AdminHomePage";
import RMAHomePage from "./features/rma/pages/RMAHomePage";
import EngineerHomePage from "./features/engineer/pages/EngineerHomePage";
import SupplyChainHomePage from "./features/supplychain/pages/SupplyChainHomePage";

import AddNewInventory from "./features/supplychain/pages/AddNewInventory";
import ListInventoryComponent from "./features/supplychain/pages/ListInventoryComponent";
import InventoryManagement from "./features/supplychain/pages/InventoryManagement";
import EditInventory from "./features/supplychain/pages/EditInventory";
import SuccessfullyAddInventory from "./features/supplychain/pages/SuccessfullyAddInventory";
import RequestDetailShow from "./features/supplychain/pages/RequestDetailShow";
import InventoryDetailsShow from "./features/supplychain/pages/InventoryDetailsShow";

import AddUser from "./features/admin/pages/AddUser";
import ManageUser from "./features/admin/pages/ManageUser";
import AddVendor from "./features/admin/pages/AddVendor";
import AddCustomer from "./features/admin/pages/AddCustomer";

import RequestPage from "./features/engineer/pages/RequestPage";
import StatusPage from "./features/engineer/pages/StatusPage";
import PartRequestManagementRMA from "./features/rma/pages/PartRequestManagementRMA";
import NotificationsPage from "./components/navbar/NotificationsPage";

import MainLayout from "./MainLayout";
import ProtectedRoute from "./features/authentication/pages/ProtectedRoute";
import ErrorBoundary from "./features/authentication/pages/ErrorBoundary";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedToken && storedRole) {
        setUser({ token: storedToken, role: storedRole });
      }

      setLoading(false);
    };

    checkToken();
  }, []);

  const handleLogin = ({ token, role }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });

    switch (role) {
      case "ADMIN":
        navigate("/admin-home");
        break;
      case "RMA":
        navigate("/rma-home");
        break;
      case "ENGINEER":
        navigate("/engineer-home");
        break;
      case "SUPPLYCHAIN":
        navigate("/supply-chain-home");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-container">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={user} />}>
              <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
                <Route path="/admin-home" element={<AdminHomePage user={user} />} />
                <Route path="/rma-home" element={<RMAHomePage user={user} />} />
                <Route path="/engineer-home" element={<EngineerHomePage user={user} />} />
                <Route path="/supply-chain-home" element={<SupplyChainHomePage user={user} />} />

                <Route path="/AddNewInventory" element={<AddNewInventory user={user} />} />
                <Route path="/ListInventoryComponent" element={<ListInventoryComponent user={user} />} />
                <Route path="/InventoryManagement" element={<InventoryManagement user={user} />} />
                <Route path="/EditInventory" element={<EditInventory user={user} />} />
                <Route path="/SuccessfullyAddInventory" element={<SuccessfullyAddInventory user={user} />} />
                <Route path="/RequestDetailShow" element={<RequestDetailShow user={user} />} />
                <Route path="/showInventory/:id" element={<InventoryDetailsShow user={user} />} />
                <Route path="/edit/:id" element={<EditInventory user={user} />} />
                <Route path="/show/:id" element={<RequestDetailShow user={user} />} />
                <Route path="/RequestPage" element={<RequestPage user={user} />} />
                <Route path="/StatusPage" element={<StatusPage user={user} />} />
                <Route path="/ManageUser" element={<ManageUser user={user} />} />
                <Route path="/AddUser" element={<AddUser user={user} />} />
                <Route path="/PartRequestManagementRMA" element={<PartRequestManagementRMA user={user} />} />
                <Route path="/AddVendor" element={<AddVendor user={user} />} />
                <Route path="/AddCustomer" element={<AddCustomer user={user} />} />
                <Route path="/notifications" element={<NotificationsPage user={user} />} />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;