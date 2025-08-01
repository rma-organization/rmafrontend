


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
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getUserNotifications,
  getRoleNotifications,
  markNotificationAsRead,
} from "../../services/api/NotificationServices";
import axiosInstance from "../../services/api/axios";

export default function NavBar() {
  const [notifications, setNotifications] = useState([]);
  const [role, setRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
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

  useEffect(() => {
    if (!role) return;

    const fetchNotifications = async () => {
      try {
        const response =
          role.toLowerCase() === "engineer"
            ? await getUserNotifications()
            : await getRoleNotifications();
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotifications();

    const token = localStorage.getItem("token");
    const socketUrl = `${axiosInstance.defaults.baseURL}/ws`;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(
          `/topic/notifications/${role.toLowerCase()}`,
          (message) => {
            const newNotification = JSON.parse(message.body);
            setNotifications((prev) => [newNotification, ...prev]);
          }
        );
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, [role]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openMobileDrawer"))
              }
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
            >
              <Badge
                badgeContent={notifications.filter((n) => !n.read).length}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
            >
              {username || "User"}
            </Typography>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {username?.[0]?.toUpperCase() || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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

      {/* Notifications Menu with Scroll */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={() => setNotificationAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      >
        <Box px={2} py={1} borderBottom="1px solid #eee">
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map((notif, i) => (
            <MenuItem
              key={notif.id || i}
              onClick={async () => {
                try {
                  await markNotificationAsRead(notif.id);
                  setNotificationAnchorEl(null);
                  setNotifications((prev) =>
                    prev.map((n) =>
                      n.id === notif.id ? { ...n, read: true } : n
                    )
                  );
                } catch (err) {
                  console.error("Failed to mark as read:", err);
                }
              }}
              sx={{
                backgroundColor: notif.read ? "transparent" : "#e3f2fd",
                fontWeight: notif.read ? "normal" : "bold",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" fontWeight="inherit">
                  {notif.type || "Notification"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.timestamp
                    ? formatDistanceToNow(new Date(notif.timestamp), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
                  {notif.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
