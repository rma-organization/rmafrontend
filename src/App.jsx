import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout"; // Import MainLayout
import AddNewInventory from "./features/supplychain/pages/AddNewInventory";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route path="AddNewInventory" element={<AddNewInventory />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
