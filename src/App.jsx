import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout"; 

import HomePage from "./features/engineer/pages/HomePage";
import RequestPage from "./features/engineer/pages/RequestPage";
import StatusPage from "./features/engineer/pages/StatusPage";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          {/* Wrap all pages inside MainLayout */}
          <Route path="/" element={<MainLayout />}>
            {/* Default page when "/" is visited */}
            <Route index  element={<HomePage />} />

            {/* Other pages */}
            <Route path="/RequestPage" element={<RequestPage />} />
            <Route path="/StatusPage" element={<StatusPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
