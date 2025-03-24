// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout"; // Import MainLayout

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Define your routes here */}
            {/* Example route */}
            {/* <Route path="/home" element={<Home />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
