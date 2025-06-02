// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const username = localStorage.getItem("username");
//     const role = localStorage.getItem("role") || "USER";

//     // === Fetch Existing Notifications ===
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/notifications?role=${role}&page=notifications`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch notifications");
//         }

//         const data = await response.json();
//         setNotifications(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     // === Setup WebSocket Connection ===
//     const socket = new SockJS("http://localhost:8080/ws");
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         username: username,
//         Authorization: `Bearer ${token}`, // Include token if backend expects it
//       },
//       onConnect: () => {
//         console.log("✅ Connected to WebSocket");

//         stompClient.subscribe("/user/queue/notifications", (message) => {
//           try {
//             const newNotification = JSON.parse(message.body);
//             console.log("🔔 New Notification:", newNotification);

//             setNotifications((prev) => {
//               const exists = prev.some((n) => n.id === newNotification.id);
//               return exists ? prev : [newNotification, ...prev];
//             });
//           } catch (err) {
//             console.error("❌ Error parsing notification", err);
//           }
//         });
//       },
//       onStompError: (frame) => {
//         console.error("❌ STOMP Error", frame);
//         setError("WebSocket error: " + frame.headers["message"]);
//       },
//     });

//     stompClient.activate();

//     return () => {
//       stompClient.deactivate();
//     };
//   }, []);

//   return (
//     <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
//       <Typography variant="h4" gutterBottom>
//         Notifications
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {!loading && !error && notifications.length === 0 && (
//         <Typography>No notifications found.</Typography>
//       )}

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//         {notifications.map((notification) => (
//           <Card key={notification.id} sx={{ backgroundColor: "#fff" }}>
//             <CardContent>
//               <Typography variant="h6">
//                 {notification.title || notification.type || "Notification"}
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {notification.message}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const username = localStorage.getItem("username");

//     if (!username || !token) {
//       setError("Missing credentials. Please log in.");
//       setLoading(false);
//       return;
//     }

//     // Fetch REST notifications
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/notifications", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch notifications");
//         const data = await response.json();
//         setNotifications(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     // Setup WebSocket connection
//     const socket = new SockJS("http://localhost:8080/ws");
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         username,
//         Authorization: `Bearer ${token}`,
//       },
//       onConnect: () => {
//         console.log("✅ Connected to WebSocket");

//         stompClient.subscribe("/user/queue/notifications", (message) => {
//           const newNotification = JSON.parse(message.body);
//           setNotifications((prev) => {
//             const exists = prev.some((n) => n.id === newNotification.id);
//             return exists ? prev : [newNotification, ...prev];
//           });
//         });
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error:", frame.headers["message"]);
//         setError("WebSocket STOMP error");
//       },
//       onWebSocketError: () => {
//         console.error("WebSocket error");
//         setError("WebSocket connection failed");
//       },
//     });

//     stompClient.activate();
//     return () => stompClient.deactivate();
//   }, []);

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
//       <Typography variant="h4" gutterBottom>Notifications</Typography>
//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}
//       {!loading && notifications.length === 0 && (
//         <Typography>No notifications found.</Typography>
//       )}
//       <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//         {notifications.map((n) => (
//           <Card key={n.id}>
//             <CardContent>
//               <Typography variant="h6">{n.type}</Typography>
//               <Typography variant="body2">{n.message}</Typography>
//               <Typography variant="caption" color="textSecondary">
//                 {new Date(n.timestamp).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }


// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const username = localStorage.getItem("username");

//     if (!username || !token) {
//       setError("Missing credentials. Please log in.");
//       setLoading(false);
//       return;
//     }

//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/notifications", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch notifications");
//         const data = await response.json();
//         setNotifications(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     const socket = new SockJS("http://localhost:8080/ws");
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         username,
//         Authorization: `Bearer ${token}`,
//       },
//       onConnect: () => {
//         console.log("✅ WebSocket connected");
//         stompClient.subscribe("/user/queue/notifications", (msg) => {
//           const newNotification = JSON.parse(msg.body);
//           setNotifications((prev) => [newNotification, ...prev]);
//         });
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error:", frame.headers["message"]);
//         setError("WebSocket STOMP error");
//       },
//       onWebSocketError: () => {
//         setError("WebSocket connection failed");
//       },
//     });

//     stompClient.activate();
//     return () => stompClient.deactivate();
//   }, []);

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
//       <Typography variant="h4" gutterBottom>Notifications</Typography>
//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}
//       {!loading && notifications.length === 0 && (
//         <Typography>No notifications found.</Typography>
//       )}
//       <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//         {notifications.map((n) => (
//           <Card key={n.id}>
//             <CardContent>
//               <Typography variant="h6">{n.type}</Typography>
//               <Typography variant="body2">{n.message}</Typography>
//               <Typography variant="caption" color="textSecondary">
//                 {new Date(n.timestamp).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function NotificationsPage() {
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
            Role: role
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
        console.log("Connected to WebSocket");

        // Subscribe to role-based topic
        stompClient.subscribe(`/topic/notifications/${role.toLowerCase()}`, (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prev) => [newNotification, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"]);
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

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && notifications.length === 0 && (
        <Typography>No notifications found.</Typography>
      )}

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {notifications.map((n) => (
          <Card key={n.id} elevation={3}>
            <CardContent>
              <Typography variant="h6">{n.type}</Typography>
              <Typography variant="body2" sx={{ my: 1 }}>
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
