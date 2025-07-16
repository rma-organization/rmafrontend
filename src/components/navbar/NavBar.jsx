import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/notifications/unread-count", {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });

        if (res.ok) {
          const count = await res.json();
          setUnreadCount(count);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Optionally poll every 30 seconds for updates
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
                {/* Notifications */}
                <IconButton onClick={() => navigate("/notifications")}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Messages placeholder */}
                <IconButton>
                  <Badge badgeContent={2} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                <Typography fontWeight="bold">Suranjan Nayanjith</Typography>
                <AccountCircle />

                {/* Logout */}
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
          >
            {/* Page content goes here */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
