
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { formatDistanceToNow } from "date-fns";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// let stompClient;

// export default function NotificationsPanel() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (!token || !role) {
//       setError("Missing authentication token or role.");
//       setLoading(false);
//       return;
//     }

//     const fetchNotifications = async () => {
//       try {
//         const url =
//           role.toLowerCase() === "engineer"
//             ? "http://localhost:8080/api/notifications/user"
//             : "http://localhost:8080/api/notifications/role";

//         const res = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Role: role,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch notifications");

//         const data = await res.json();
//         setNotifications(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     // Setup WebSocket connection
//     stompClient = new Client({
//       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       reconnectDelay: 5000,
//       onConnect: () => {
//         stompClient.subscribe(`/topic/notifications/${role.toLowerCase()}`, (msg) => {
//           const newNotification = JSON.parse(msg.body);
//           setNotifications((prev) =>
//             prev.some((n) => n.id === newNotification.id) ? prev : [newNotification, ...prev]
//           );
//         });
//       },
//     });

//     stompClient.activate();

//     return () => {
//       stompClient.deactivate();
//     };
//   }, []);

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`http://localhost:8080/api/notifications/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete notification");
//       setNotifications((prev) => prev.filter((n) => n.id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const markAsRead = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`http://localhost:8080/api/notifications/${id}/mark-read`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to mark as read");
//       setNotifications((prev) =>
//         prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <CircularProgress sx={{ m: 2 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (notifications.length === 0)
//     return <Typography sx={{ p: 2, color: "gray" }}>No notifications found.</Typography>;

//   return (
//     <Box sx={{ width: 400, backgroundColor: "#212121", color: "#fff", borderRadius: 2 }}>
//       <Box sx={{ p: 2, borderBottom: "1px solid #333" }}>
//         <Typography variant="h6" fontWeight="bold">
//           Notifications
//         </Typography>
//       </Box>
//       <List>
//         {notifications.map((n) => (
//           <ListItem
//             key={n.id}
//             onClick={() => markAsRead(n.id)}
//             sx={{
//               backgroundColor: n.read ? "#2c2c2c" : "inherit",
//               cursor: "pointer",
//             }}
//             secondaryAction={
//               <IconButton edge="end" onClick={() => handleDelete(n.id)}>
//                 <DeleteIcon sx={{ color: "#fff" }} />
//               </IconButton>
//             }
//           >
//             <ListItemAvatar>
//               <Avatar sx={{ bgcolor: "#3f51b5" }}>{n.type?.[0] ?? "N"}</Avatar>
//             </ListItemAvatar>
//             <ListItemText
//               primary={<Typography fontWeight="bold">{n.type}</Typography>}
//               secondary={
//                 <>
//                   <Typography variant="body2">{n.message}</Typography>
//                   <Typography variant="caption" color="gray">
//                     {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
//                   </Typography>
//                 </>
//               }
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { formatDistanceToNow } from "date-fns";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getUserNotifications,
  getRoleNotifications,
  deleteNotification,
  markNotificationAsRead,
} from "../../services/api/NotificationServices";

let stompClient;

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || !role) {
      setError("Missing token or role");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res =
          role.toLowerCase() === "engineer"
            ? await getUserNotifications()
            : await getRoleNotifications();
        setNotifications(res.data);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(
          `/topic/notifications/${role.toLowerCase()}`,
          (msg) => {
            const notif = JSON.parse(msg.body);
            setNotifications((prev) =>
              prev.some((n) => n.id === notif.id)
                ? prev
                : [notif, ...prev]
            );
          }
        );
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError("Failed to delete notification");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (notifications.length === 0)
    return (
      <Typography sx={{ p: 2, color: "gray" }}>No notifications found.</Typography>
    );

  return (
    <Box
      sx={{
        width: 400,
        backgroundColor: "#212121",
        color: "#fff",
        borderRadius: 2,
        boxShadow: 4,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #333",
          backgroundColor: "#1e1e1e",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Notifications
        </Typography>
      </Box>
      <List>
        {notifications.map((n) => (
          <ListItem
            key={n.id}
            onClick={() => handleMarkAsRead(n.id)}
            sx={{
              backgroundColor: n.read ? "#2c2c2c" : "#3949ab",
              cursor: "pointer",
              color: "#fff",
              "&:hover": {
                backgroundColor: n.read ? "#3a3a3a" : "#303f9f",
              },
            }}
            secondaryAction={
              <>
                {!n.read && (
                  <Tooltip title="Mark as read">
                    <IconButton onClick={() => handleMarkAsRead(n.id)} sx={{ color: "#fff" }}>
                      <MarkEmailReadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton edge="end" onClick={() => handleDelete(n.id)} sx={{ color: "#fff" }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <ListItemAvatar>
              <Badge
                color="error"
                variant="dot"
                invisible={n.read}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <Avatar sx={{ bgcolor: "#3f51b5" }}>{n.type?.[0] ?? "N"}</Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="#fff">
                  {n.type}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="gray">
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="lightgray">
                    {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

