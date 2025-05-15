// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Badge,
//   CssBaseline,
//   Button,
// } from "@mui/material";
// import {
//   Notifications as NotificationsIcon,
//   Mail as MailIcon,
//   AccountCircle,
// } from "@mui/icons-material";

// export default function NavBar() {
//   const [notifications, setNotifications] = useState([]);
//   const [messageCount, setMessageCount] = useState(2);
//   const [role, setRole] = useState("USER");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/notifications?role=${role}&page=dashboard`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           if (response.status === 401) {
//             handleLogout();
//           } else if (response.status === 403) {
//             throw new Error("Access denied: You do not have permission.");
//           } else {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//         }

//         const data = await response.json();
//         setNotifications(data);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//         setError(err.message);
//       }
//     };

//     fetchNotifications();
//   }, [role]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   return (
//     <>
//       <CssBaseline />
//       <Box sx={{ display: "flex", height: "100vh" }}>
//         <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//           <AppBar
//             position="fixed"
//             sx={{
//               zIndex: (theme) => theme.zIndex.drawer + 1,
//               backgroundColor: "#fff",
//               color: "#000",
//               boxShadow: 1,
//               width: `calc(100% - 320px)`,
//               left: "320px",
//             }}
//           >
//             <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <IconButton>
//                   <Badge badgeContent={notifications.length} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <IconButton>
//                   <Badge badgeContent={messageCount} color="error">
//                     <MailIcon />
//                   </Badge>
//                 </IconButton>
//                 <Typography fontWeight="bold">Suranjan Nayanjith</Typography>
//                 <AccountCircle />

//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleLogout}
//                   sx={{ ml: 2 }}
//                 >
//                   Logout
//                 </Button>
//               </Box>
//             </Toolbar>
//           </AppBar>

//           <Box
//             component="main"
//             sx={{
//               flexGrow: 1,
//               paddingTop: "80px",
//               paddingX: 2,
//               overflowY: "auto",
//               backgroundColor: "#f5f5f5",
//               minHeight: "100vh",
//             }}
//           ></Box>
//         </Box>
//       </Box>
//     </>
//   );
// }


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
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  AccountCircle,
} from "@mui/icons-material";

export default function NavBar() {
  const [notifications, setNotifications] = useState([]);
  const [messageCount, setMessageCount] = useState(2);
  const [role, setRole] = useState("USER");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedRole) {
      setRole(savedRole);
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications?role=${savedRole}&page=dashboard`,
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
              width: `calc(100% - 320px)`,
              left: "320px",
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={() => navigate("/notifications")}>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton>
                  <Badge badgeContent={messageCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <Typography fontWeight="bold">Suranjan Nayanjith</Typography>
                <AccountCircle />

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

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
