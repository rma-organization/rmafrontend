import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import jwtDecode from "jwt-decode";

export default function RequestStatusChart() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded?.sub || decoded?.username || "User";
        setUserName(name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <Box p={2} mt={5}>
      <Box
        sx={{
          bgcolor: "lightgray",
          height: "70px",
          display: "flex",
          alignItems: "center",
          pl: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="black">
          {userName}, Successfully Added
        </Typography>
        <PlaylistAddCheckIcon sx={{ color: "black", ml: 2, fontSize: 50 }} />
      </Box>

      <Box mt={30}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="black"
          textAlign="center"
        >
          The new component has been successfully <br />
          integrated into the database
        </Typography>
      </Box>
    </Box>
  );
}
