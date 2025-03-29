import React from "react";
import { Box } from "@mui/material";
import NavBar from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/navbar/Sidebar";
const MainLayout = () => {
  return (
    <Box display="flex" height="100vh" width="100vw">
      {/* Sidebar */}
      <Box width="320px">
        <Sidebar />
      </Box>

      {/* Main Content Area */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Navbar */}
        <Box height="64px" width="calc(100vw - 320px)">
          {/* You can include NavBar here */}
           <NavBar /> 
        </Box>

        {/* Page Content */}
        <Box flexGrow={1} padding={2} bgcolor="Snow">
          <Outlet /> {/* Nested Routes Render Here */}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
