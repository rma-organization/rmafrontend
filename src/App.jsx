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

import HomePage from "./features/engineer/pages/HomePage";
import RequestPage from "./features/engineer/pages/RequestPage";
import StatusPage from "./features/engineer/pages/StatusPage";
import ManageUser from "./features/admin/pages/ManageUser";
function App() {
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
          </Route>
        </Routes>
      </Router>
    </div>
  );  
}

export default App;
