import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import ChatDrawer from "./ChatDrawer";

export default function NavBar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

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
    setChatOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: 1,
          width: isMobile ? "100%" : "calc(100% - 320px)",
          left: isMobile ? 0 : "320px",
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          {/* Menu icon for mobile sidebar toggle */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => {
                const event = new CustomEvent("openMobileDrawer");
                window.dispatchEvent(event);
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Right icons container pushed to the right */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ marginLeft: "auto" }}
          >
            <IconButton
              color="inherit"
              aria-label="notifications"
              onClick={() => navigate("/notifications")}
            >
              <NotificationsIcon />
            </IconButton>

            <IconButton color="inherit" onClick={toggleChatDrawer}>
              <Badge badgeContent={unreadCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
            >
              {username || "User"}
            </Typography>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {username ? username.charAt(0).toUpperCase() : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Box px={2} py={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {username || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body1" color="error">
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      {/* Chat Drawer */}
      <ChatDrawer
        open={chatOpen}
        onClose={toggleChatDrawer}
        onUnreadCountUpdate={(count) => setUnreadCount(count)}
      />
    </>
  );
}
