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


function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
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
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
