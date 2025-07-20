import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  AccountCircle,
} from "@mui/icons-material";
import ChatDrawer from "./ChatDrawer";

export default function NavBar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleUnreadCountUpdate = (count) => {
    setUnreadCount(count);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername || "");
    setRole(storedRole || "USER");

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications?role=${storedRole}&page=dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleChatDrawer = () => {
    setChatOpen(!chatOpen);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

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
              width: "calc(100% - 320px)",
              left: "320px",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "& > *": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {/* Notifications */}
                <IconButton
                  color="inherit"
                  aria-label="notifications"
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Chat Drawer */}
                <IconButton
                  color="inherit"
                  aria-label="open chat"
                  onClick={toggleChatDrawer}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                {/* Username */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
                >
                  {username || "User"}
                </Typography>

                {/* Avatar */}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ p: 0 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                minWidth: "200px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {username || "User"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {role || "No role"}
              </Typography>
            </Box>

            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.08)",
                },
              }}
            >
              <Typography variant="body1">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Chat Drawer */}
          <ChatDrawer
            open={chatOpen}
            onClose={toggleChatDrawer}
            onUnreadCountUpdate={handleUnreadCountUpdate}
          />

          {/* Main Content */}
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
            {error && (
              <Typography color="error" sx={{ px: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
