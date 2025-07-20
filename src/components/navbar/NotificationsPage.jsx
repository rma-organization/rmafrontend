import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      setError("Missing credentials or role. Please log in.");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/notifications/role", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/notifications/${role.toLowerCase()}`, (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prev) => [newNotification, ...prev]);
        });
      },
      onStompError: () => {
        setError("STOMP error occurred.");
      },
      onWebSocketError: () => {
        setError("WebSocket connection failed.");
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError("Error deleting notification: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 64,
        right: 20,
        width: 400,
        maxHeight: 600,
        backgroundColor: "#212121",
        color: "#fff",
        borderRadius: 2,
        overflow: "auto",
        boxShadow: 4,
        zIndex: 2000,
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #333" }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          Notifications
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress color="inherit" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && notifications.length === 0 && (
        <Typography sx={{ p: 2, color: "gray" }}>No notifications found.</Typography>
      )}

      <List disablePadding>
        {notifications.map((n, index) => (
          <React.Fragment key={n.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  sx={{ color: "white" }}
                  onClick={() => handleDelete(n.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                "&:hover": {
                  backgroundColor: "#333",
                },
                px: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#3f51b5" }}>{n.type?.charAt(0) || "N"}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="bold" color="white" component="span">
                    {n.type}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="gray"
                      component="span"
                      display="block"
                    >
                      {n.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="gray"
                      component="span"
                      display="block"
                    >
                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index !== notifications.length - 1 && (
              <Divider sx={{ backgroundColor: "#444", mx: 2 }} />
            )}
          </React.Fragment>
        ))}
      </List>

      <Box textAlign="center" sx={{ p: 2 }}>
        <Typography variant="body2" color="lightblue" sx={{ cursor: "pointer" }}>
          See all notifications
        </Typography>
      </Box>
    </Box>
  );
}
