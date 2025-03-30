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
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout"; // Import MainLayout
//supplychain
import AddNewInventory from "./features/supplychain/pages/AddNewInventory";
import ListInventoryComponent from "./features/supplychain/pages/ListInventoryComponent";
import SupplyChainHomePage from "./features/supplychain/pages/SupplyChainHomePage";
import InventoryManagement from "./features/supplychain/pages/InventoryManagement";
import EditInventory from "./features/supplychain/pages/EditInventory"; 
import SuccessfullyAddInventory from "./features/supplychain/pages/SuccessfullyAddInventory";
import RequestDetailShow from "./features/supplychain/pages/RequestDetailShow"; 
import InventoryDetailsShow from "./features/supplychain/pages/InventoryDetailsShow"; 
import AddUser from "./features/admin/pages/AddUser";

import HomePage from "./features/engineer/pages/HomePage";
import RequestPage from "./features/engineer/pages/RequestPage";
import StatusPage from "./features/engineer/pages/StatusPage";
import ManageUser from "./features/admin/pages/ManageUser";
import PartRequestManagementRMA from "./features/rma/pages/PartRequestManagementRMA";
import RMAHomePage from "./features/rma/pages/RMAHomePage";

import AddVendor from "./features/admin/pages/AddVendor";
import AddCustomer from "./features/admin/pages/AddCustomer";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      console.log("Restoring User:", { token: storedToken, role: storedRole });
      setUser ({ token: storedToken, role: storedRole });
    }
  }, []);

  const handleLogin = (loginData) => {
    const { token, role } = loginData;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser ({ role, token });

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
    setUser (null);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Wrap all pages inside MainLayout */}
          <Route path="/" element={<MainLayout />}>
            {/* Default Home Page */}
            <Route index element={<HomePage />} />
  
            {/* Inventory Management Routes */}
            <Route path="AddNewInventory" element={<AddNewInventory />} />
            <Route path="ListInventoryComponent" element={<ListInventoryComponent />} />
            <Route path="InventoryManagement" element={<InventoryManagement />} />
            <Route path="SupplyChainHomePage" element={<SupplyChainHomePage />} />
            <Route path="EditInventory" element={<EditInventory />} />
            <Route path="SuccessfullyAddInventory" element={<SuccessfullyAddInventory />} />
            <Route path="RequestDetailShow" element={<RequestDetailShow />} />
            <Route path="showInventory/:id" element={<InventoryDetailsShow />} />
            <Route path="edit/:id" element={<EditInventory />} />
            <Route path="show/:id" element={<RequestDetailShow />} />
  
            {/* Request and Status Pages */}
            <Route path="RequestPage" element={<RequestPage />} />
            <Route path="StatusPage" element={<StatusPage />} />
            <Route path="ManageUser" element={<ManageUser />} />
            <Route path="AddUser" element={<AddUser />} />
            <Route path="PartRequestManagementRMA" element={<PartRequestManagementRMA/>} />
            <Route path="RMAHomePage" element={<RMAHomePage/>} />
            <Route path="AddVendor" element={<AddVendor />} />
            <Route path="AddCustomer" element={<AddCustomer />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );  
}

export default App;