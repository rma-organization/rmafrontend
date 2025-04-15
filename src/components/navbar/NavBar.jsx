import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  CssBaseline,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  AccountCircle,
} from "@mui/icons-material";
import ChatDrawer from "./ChatDrawer"; // 👈 Make sure this path is correct

export default function NavBar() {
  const [notifications, setNotifications] = useState([]);
  const [messageCount, setMessageCount] = useState(2);
  const [role, setRole] = useState("USER");
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false); // 👈 New state

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications?role=${role}&page=dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Access denied: You do not have permission.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      }
    };

    fetchNotifications();
  }, [role]);

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Navbar */}
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
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: { xs: "60%", sm: "40%", md: "35%" } }}></Box>

              {/* Right Icons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Inbox Icon triggers drawer */}
                <IconButton onClick={() => setChatOpen(true)}>
                  <Badge badgeContent={messageCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                <Typography fontWeight="bold">Suranjan Nayanjith</Typography>
                <AccountCircle />
              </Box>
            </Toolbar>
          </AppBar>

          {/* Main content */}
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

      {/* Chat Drawer Component */}
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
