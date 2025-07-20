import React from "react";
import { Box, useMediaQuery, Toolbar } from "@mui/material";
import NavBar from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/navbar/Sidebar";

const MainLayout = () => {
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Box display="flex" width="100vw">
      {/* Sidebar only takes space on large screens */}
      {!isMobile && (
        <Box width="320px">
          <Sidebar />
        </Box>
      )}

      {/* Main Content */}
      <Box flexGrow={1} display="flex" flexDirection="column" height="100vh">
        <Box height="64px" width="100%">
          <NavBar />
        </Box>

        {/* Spacer under AppBar on mobile */}
        {isMobile && <Toolbar />}

        <Box flexGrow={1} overflow="auto" p={2} bgcolor="#f9f9f9">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;