
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

  // Listen for unread count changes from ChatDrawer
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

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedRole) {
      setRole(storedRole);
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/notifications?role=${storedRole || role}&page=dashboard`,
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
          } else if (response.status === 403) {
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
    setChatOpen(!chatOpen);
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
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                '& > *': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}>
                {/* Notifications Icon */}
                <IconButton color="inherit">
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Inbox Icon */}
                <IconButton color="inherit" onClick={toggleChatDrawer}>
                  <Badge badgeContent={unreadCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                {/* Username Display */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {username || "User"}
                </Typography>

                {/* Profile Icon */}
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
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    {username ? username.charAt(0).toUpperCase() : <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Profile Menu Dropdown */}
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
              '& .MuiPaper-root': {
                minWidth: '200px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px'
              }
            }}
          >
            {/* User Info Section */}
            <Box sx={{ 
              px: 2, 
              py: 1,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
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

            {/* Logout Button */}
            <MenuItem 
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.08)'
                }
              }}
            >
              <Typography variant="body1">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Chat Drawer Component */}
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
          ></Box>
        </Box>
      </Box>
    </>
  );
}