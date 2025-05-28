// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const role = localStorage.getItem("role") || "USER";

//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/notifications?role=${role}&page=notifications`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch notifications");

//         const data = await response.json();
//         setNotifications(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     // WebSocket connection
//     const socket = new SockJS("http://localhost:8080/ws");
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       onConnect: () => {
//         stompClient.subscribe("/user/queue/notifications", (message) => {
//           const notification = JSON.parse(message.body);
//           setNotifications((prev) => [...prev, notification]);
//         });
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error", frame.headers["message"]);
//       },
//     });

//     stompClient.activate();

//     return () => {
//       stompClient.deactivate();
//     };
//   }, [token]);

//   if (loading)
//     return (
//       <Box
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );

//   return (
//     <Box
//       sx={{
//         flexGrow: 1,
//         height: "100%",
//         padding: 3,
//         overflowY: "auto",
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         Notifications
//       </Typography>
//       <List>
//         {notifications.map((notif, index) => (
//           <React.Fragment key={notif.id || index}>
//             <ListItem alignItems="flex-start">
//               <ListItemText
//                 primary={notif.title || "System Message"}
//                 secondary={notif.message}
//               />
//             </ListItem>
//             <Divider />
//           </React.Fragment>
//         ))}
//       </List>
//     </Box>
//   );
//
// src/pages/NotificationsPage.jsximport React, { useEffect, useState } from 'react';
// src/pages/NotificationsPage.jsx

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { Snackbar, Alert } from '@mui/material';

let stompClient = null;

const NotificationsPage = () => {
  const [notification, setNotification] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      console.error("No token found.");
      return;
    }

    const socket = new SockJS("http://localhost:8080/rma-ws"); // matches your WebSocket endpoint
    stompClient = over(socket);

    stompClient.connect(
      { Authorization: `Bearer ${token}` }, // Spring will need a WebSocketAuthInterceptor
      () => {
        console.log("✅ STOMP Connected");

        // Personal user-specific notifications
        stompClient.subscribe("/user/queue/notifications", (msg) => {
          const data = JSON.parse(msg.body);
          setNotification(data.message);
        });

        // Role-based notifications
        if (role) {
          stompClient.subscribe(`/topic/role-${role.toUpperCase()}`, (msg) => {
            const data = JSON.parse(msg.body);
            setNotification(data.message);
          });
        }

        // Global notifications
        stompClient.subscribe("/topic/global", (msg) => {
          const data = JSON.parse(msg.body);
          setNotification(data.message);
        });
      },
      (error) => {
        console.error("WebSocket connection error", error);
      }
    );

    // Cleanup on component unmount
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [token, role]);

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={() => setNotification(null)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity="info" onClose={() => setNotification(null)} sx={{ width: '100%' }}>
        {notification}
      </Alert>
    </Snackbar>
  );
};

export default NotificationsPage;

