import React from "react";
import { Box, useMediaQuery, Toolbar } from "@mui/material";
import NavBar from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/navbar/Sidebar";

const MainLayout = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box display="flex" width="100vw" height="100vh" overflow="hidden">
      {/* Sidebar is always rendered and handles logic internally */}
      <Sidebar />

      {/* Main content area */}
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        height="100vh"
        overflow="hidden"
        sx={{ ml: isMobile ? 0 : "320px" }}
      >
        <NavBar />
        <Toolbar />
        <Box
          flexGrow={1}
          minHeight={0}
          overflow="auto"
          p={2}
          bgcolor="#f9f9f9"
          display="flex"
          flexDirection="column"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
