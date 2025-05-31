import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  CssBaseline,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  AccountCircle,
} from "@mui/icons-material";

export default function NavBar() {
  const messageCount = 2; // Static or mock value
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: 1,
              width: `calc(100% - 320px)`,
              left: "320px",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* 👉 Navigate to notifications page */}
                <IconButton onClick={() => navigate("/notifications")}>
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <IconButton>
                  <Badge badgeContent={messageCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                <Typography fontWeight="bold">Suranjan Nayanjith</Typography>
                <AccountCircle />

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              paddingTop: "80px",
              paddingX: 2,
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
              minHeight: "100vh",
            }}
          ></Box>
        </Box>
      </Box>
    </>
  );
}
