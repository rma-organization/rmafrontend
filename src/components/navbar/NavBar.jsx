
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Badge,
//   Menu,
//   MenuItem,
//   Avatar,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   Menu as MenuIcon,
//   AccountCircle,
// } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// export default function NavBar() {
//   const [notifications, setNotifications] = useState([]);
//   const [role, setRole] = useState("USER");
//   const [username, setUsername] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery("(max-width:900px)");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUsername = localStorage.getItem("username");
//     const storedRole = localStorage.getItem("role");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (storedUsername) setUsername(storedUsername);
//     if (storedRole) setRole(storedRole);
//   }, [navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (!token || !role) return;

//     const fetchNotifications = async () => {
//       try {
//         let url = "http://localhost:8080/api/notifications/role";
//         if (role.toLowerCase() === "engineer") {
//           url = "http://localhost:8080/api/notifications/user";
//         }

//         const response = await fetch(url, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             Role: role,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setNotifications(data);
//         } else {
//           console.error("Failed to fetch notifications, status:", response.status);
//         }
//       } catch (err) {
//         console.error("Failed to fetch notifications", err);
//       }
//     };

//     fetchNotifications();

//     const stompClient = new Client({
//       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       reconnectDelay: 5000,
//       onConnect: () => {
//         stompClient.subscribe(`/topic/notifications/${role.toLowerCase()}`, (message) => {
//           const newNotification = JSON.parse(message.body);
//           setNotifications((prev) => [newNotification, ...prev]);
//         });
//       },
//     });

//     stompClient.activate();

//     return () => {
//       stompClient.deactivate();
//     };
//   }, [role]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//     navigate("/login");
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleNotificationOpen = (event) => {
//     setNotificationAnchorEl(event.currentTarget);
//   };

//   const handleNotificationClose = () => {
//     setNotificationAnchorEl(null);
//   };

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backgroundColor: "#fff",
//           color: "#000",
//           boxShadow: 1,
//           width: isMobile ? "100%" : "calc(100% - 320px)",
//           left: isMobile ? 0 : "320px",
//         }}
//       >
//         <Toolbar sx={{ display: "flex" }}>
//           {isMobile && (
//             <IconButton
//               color="inherit"
//               edge="start"
//               onClick={() => {
//                 const event = new CustomEvent("openMobileDrawer");
//                 window.dispatchEvent(event);
//               }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}

//           <Box
//             display="flex"
//             alignItems="center"
//             gap={2}
//             sx={{ marginLeft: "auto" }}
//           >
//             <IconButton
//               color="inherit"
//               aria-label="notifications"
//               onClick={handleNotificationOpen}
//             >
//               <Badge badgeContent={notifications.length} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>

//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
//             >
//               {username || "User"}
//             </Typography>

//             <IconButton
//               edge="end"
//               aria-label="account of current user"
//               aria-controls="profile-menu"
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//               sx={{ p: 0 }}
//             >
//               <Avatar sx={{ bgcolor: "primary.main" }}>
//                 {username ? username.charAt(0).toUpperCase() : <AccountCircle />}
//               </Avatar>
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <Box px={2} py={1}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             {username || "User"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {role}
//           </Typography>
//         </Box>
//         <MenuItem onClick={handleLogout}>
//           <Typography variant="body1" color="error">
//             Logout
//           </Typography>
//         </MenuItem>
//       </Menu>

//       {/* Notification Menu */}
//       <Menu
//         anchorEl={notificationAnchorEl}
//         open={Boolean(notificationAnchorEl)}
//         onClose={handleNotificationClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//         sx={{
//           "& .MuiPaper-root": {
//             minWidth: 300,
//             maxHeight: 400,
//             overflowY: "auto",
//             borderRadius: "8px",
//           },
//         }}
//       >
//         <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #eee" }}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             Notifications
//           </Typography>
//         </Box>

//         {notifications.length === 0 ? (
//           <MenuItem disabled>No new notifications</MenuItem>
//         ) : (
//           notifications.slice(0, 5).map((notif, index) => (
//             <MenuItem key={index} onClick={handleNotificationClose}>
//               <Box>
//                 <Typography variant="body2" fontWeight="bold">
//                   {notif.type || "New Notification"}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {notif.timestamp
//                     ? formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })
//                     : "Just now"}
//                 </Typography>
//                 <Typography variant="body2">{notif.message}</Typography>
//               </Box>
//             </MenuItem>
//           ))
//         )}
//       </Menu>
//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Badge,
//   Menu,
//   MenuItem,
//   Avatar,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   Menu as MenuIcon,
//   AccountCircle,
// } from "@mui/icons-material";
// import { formatDistanceToNow } from "date-fns";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import {
//   getUserNotifications,
//   getRoleNotifications,
//   markNotificationAsRead,
// } from "../../services/api/NotificationServices";

// export default function NavBar() {
//   const [notifications, setNotifications] = useState([]);
//   const [role, setRole] = useState("USER");
//   const [username, setUsername] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery("(max-width:900px)");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUsername = localStorage.getItem("username");
//     const storedRole = localStorage.getItem("role");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (storedUsername) setUsername(storedUsername);
//     if (storedRole) setRole(storedRole);
//   }, [navigate]);

//   useEffect(() => {
//     if (!role) return;

//     const fetchNotifications = async () => {
//       try {
//         const response =
//           role.toLowerCase() === "engineer"
//             ? await getUserNotifications()
//             : await getRoleNotifications();
//         setNotifications(response.data);
//       } catch (err) {
//         console.error("Failed to load notifications:", err);
//       }
//     };

//     fetchNotifications();

//     const token = localStorage.getItem("token");

//     const stompClient = new Client({
//       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       reconnectDelay: 5000,
//       onConnect: () => {
//         stompClient.subscribe(
//           `/topic/notifications/${role.toLowerCase()}`,
//           (message) => {
//             const newNotification = JSON.parse(message.body);
//             setNotifications((prev) => [newNotification, ...prev]);
//           }
//         );
//       },
//     });

//     stompClient.activate();
//     return () => stompClient.deactivate();
//   }, [role]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backgroundColor: "#fff",
//           color: "#000",
//           boxShadow: 1,
//           width: isMobile ? "100%" : "calc(100% - 320px)",
//           left: isMobile ? 0 : "320px",
//         }}
//       >
//         <Toolbar>
//           {isMobile && (
//             <IconButton
//               color="inherit"
//               onClick={() =>
//                 window.dispatchEvent(new CustomEvent("openMobileDrawer"))
//               }
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
//             <IconButton
//               color="inherit"
//               onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
//             >
//               <Badge
//                 badgeContent={notifications.filter((n) => !n.read).length}
//                 color="error"
//               >
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
//             >
//               {username || "User"}
//             </Typography>
//             <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
//               <Avatar sx={{ bgcolor: "primary.main" }}>
//                 {username?.[0]?.toUpperCase() || <AccountCircle />}
//               </Avatar>
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Box px={2} py={1}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             {username || "User"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {role}
//           </Typography>
//         </Box>
//         <MenuItem onClick={handleLogout}>
//           <Typography variant="body1" color="error">
//             Logout
//           </Typography>
//         </MenuItem>
//       </Menu>

//       {/* Notifications Menu */}
//       <Menu
//         anchorEl={notificationAnchorEl}
//         open={Boolean(notificationAnchorEl)}
//         onClose={() => setNotificationAnchorEl(null)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Box px={2} py={1} borderBottom="1px solid #eee">
//           <Typography variant="subtitle1" fontWeight="bold">
//             Notifications
//           </Typography>
//         </Box>
//         {notifications.length === 0 ? (
//           <MenuItem disabled>No new notifications</MenuItem>
//         ) : (
//           notifications.slice(0, 5).map((notif, i) => (
//             <MenuItem
//               key={notif.id || i}
//               onClick={async () => {
//                 try {
//                   await markNotificationAsRead(notif.id); // mark read backend
//                   setNotificationAnchorEl(null);
//                   setNotifications((prev) =>
//                     prev.map((n) =>
//                       n.id === notif.id ? { ...n, read: true } : n
//                     )
//                   );
//                 } catch (err) {
//                   console.error("Failed to mark as read:", err);
//                 }
//               }}
//               sx={{
//                 backgroundColor: notif.read ? "transparent" : "#e3f2fd", // light blue background for unread
//                 fontWeight: notif.read ? "normal" : "bold",
//               }}
//             >
//               <Box sx={{ display: "flex", flexDirection: "column" }}>
//                 <Typography variant="body2" fontWeight="inherit">
//                   {notif.type || "Notification"}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {notif.timestamp
//                     ? formatDistanceToNow(new Date(notif.timestamp), {
//                         addSuffix: true,
//                       })
//                     : "Just now"}
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
//                   {notif.message}
//                 </Typography>
//               </Box>
//             </MenuItem>
//           ))
//         )}
//       </Menu>
//     </>
//   );
// }


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
