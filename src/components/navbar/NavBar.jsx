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

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications/role`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Role: storedRole || role,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
          } else if (response.status === 403) {
            throw new Error("Access denied: You do not have permission.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const data = await response.json();
        setNotifications(data);

        // Optional: uncomment if you want to calculate unread count from here
        // const unread = data.filter((n) => !n.read).length;
        // setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message || "Failed to load notifications");
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [navigate, role]);

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
    setChatOpen((prev) => !prev);
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
                {/* Notifications Icon (count removed) */}
                <IconButton
                  color="inherit"
                  aria-label="notifications"
                  onClick={() => navigate("/notifications")}
                >
                  <NotificationsIcon />
                </IconButton>

                {/* Chat Icon (count remains here if needed) */}
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

                {/* Avatar/Profile Icon */}
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
                    {username
                      ? username.charAt(0).toUpperCase()
                      : <AccountCircle />}
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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

          {/* Main Content Area */}
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
              <Typography color="error" sx={{ px: 2, mb: 1 }}>
                {error}
              </Typography>
            )}
            {/* Page content goes here */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
