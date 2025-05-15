import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SplashScreen from "./features/authentication/pages/SplashScreen";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";
import AdminHomePage from "./features/admin/AdminHomePage";
import RMAHomePage from "./features/rma/pages/RMAHomePage";
import EngineerHomePage from "./features/engineer/pages/EngineerHomePage";
import MainLayout from "./MainLayout";

import ProtectedRoute from "./features/authentication/pages/ProtectedRoute";
import ErrorBoundary from "./features/authentication/pages/ErrorBoundary";

import AddNewInventory from "./features/supplychain/pages/AddNewInventory";
import ListInventoryComponent from "./features/supplychain/pages/ListInventoryComponent";
import SupplyChainHomePage from "./features/supplychain/pages/SupplyChainHomePage";
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

      setLoading(false); // Done checking token
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
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route element={<ProtectedRoute user={user} />}>
              <Route element={<MainLayout />}>
                <Route path="/admin-home" element={<AdminHomePage />} />
                <Route path="/rma-home" element={<RMAHomePage />} />
                <Route path="/engineer-home" element={<EngineerHomePage />} />
                <Route path="/supply-chain-home" element={<SupplyChainHomePage />} />
                <Route path="AddNewInventory" element={<AddNewInventory />} />
                <Route path="ListInventoryComponent" element={<ListInventoryComponent />} />
                <Route path="InventoryManagement" element={<InventoryManagement />} />
                <Route path="EditInventory" element={<EditInventory />} />
                <Route path="SuccessfullyAddInventory" element={<SuccessfullyAddInventory />} />
                <Route path="RequestDetailShow" element={<RequestDetailShow />} />
                <Route path="showInventory/:id" element={<InventoryDetailsShow />} />
                <Route path="edit/:id" element={<EditInventory />} />
                <Route path="show/:id" element={<RequestDetailShow />} />
                <Route path="RequestPage" element={<RequestPage />} />
                <Route path="StatusPage" element={<StatusPage />} />
                <Route path="ManageUser" element={<ManageUser />} />
                <Route path="AddUser" element={<AddUser />} />
                <Route path="PartRequestManagementRMA" element={<PartRequestManagementRMA />} />
                <Route path="AddVendor" element={<AddVendor />} />
                <Route path="AddCustomer" element={<AddCustomer />} />
                 <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;
