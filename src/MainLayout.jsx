import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/navbar/Sidebar";
import { Outlet } from "react-router-dom";

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
        <Box height="64px">
          {/* You can include NavBar here */}
          {/* <NavBar /> */}
        </Box>

        {/* Page Content */}
        <Box flexGrow={1} padding={2} bgcolor="Snow">
          <Outlet /> {/* This is where nested routes will be rendered */}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
