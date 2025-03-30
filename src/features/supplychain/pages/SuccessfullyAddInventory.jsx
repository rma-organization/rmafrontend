import React from "react";

import { Box, Typography, Paper, InputBase, Divider, IconButton } from "@mui/material";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';




export default function RequestStatusChart() {
  return (
    <Box p={2} mt={5}>
      {/* Welcome Banner */}
      <Box sx={{ bgcolor: "lightgray", height: "70px", display: "flex", alignItems: "center", pl: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="black">
           Suranjan Nayanjith, Successfully Added
        </Typography>
        <PlaylistAddCheckIcon sx={{ color: "black", ml: 2,  fontSize: 50 }} />
      </Box>

      
      

      <Box mt={30}>
      <Typography variant="h4" fontWeight="bold" color="black" textAlign="center">
  The new component has been successfully <br />integrated into the database
</Typography>
      </Box>
    </Box>
  );
}
