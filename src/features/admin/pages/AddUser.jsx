import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Card, CardContent, Grid, TextField, Box,
  MenuItem, Select
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Optional role mapping for display (you can use it if you want)
const roleMapping = {
  ADMIN: "System Admin",
  ENGINEER: "Engineer",
  SUPPLYCHAIN: "Supply Chain Team",
  RMA: "RMA",
};

const AddUser = () => {
  // State to store pending users
  const [users, setUsers] = useState([]);

  // Form state for selected username and status
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("PENDING");

  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Get pending users from backend
  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/pending-users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setUsers([]);
    }
  };

  // Form input handlers
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleStatusChange = (event) => setStatus(event.target.value);

  // Populate form with selected user's data
  const handleFillFields = (user) => {
    setUsername(user.username);
    setStatus(user.approvalStatus);
  };

  // Send approval decision to backend
  const handleApproveUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, approvalStatus: status }),
      });

      if (response.ok) {
        // Remove approved user from table
        setUsers(users.filter(user => user.username !== username));
        setUsername("");
        setStatus("PENDING");
      } else {
        const errorMsg = await response.text();
        console.error("Failed to approve user:", errorMsg);
      }
    } catch (error) {
      console.error("Error approving user:", error.message);
    }
  };

  return (
    <Box p={2} mt={1}>
      <Button variant="contained" disableElevation onClick={() => navigate("/admin-home")}>Home</Button>
      <Card sx={{ maxWidth: "1100px", margin: "auto", mt: 4, padding: "20px", backgroundColor: "#f5f5f5" }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Approve User</Typography>
          </Box>
          {/* User input form */}
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="User Name"
                fullWidth
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                sx={{ mb: 2 }}
              />
              <Select
                fullWidth
                value={status}
                onChange={handleStatusChange}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <MenuItem value="APPROVED">APPROVED</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="REJECTED">REJECTED</MenuItem>
              </Select>
            </Grid>
          </Grid>
          {/* Approve button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "blue", color: "white" }}
            onClick={handleApproveUser}
          >
            Approve User
          </Button>
        </CardContent>
        {/* Table of pending users */}
        <Paper sx={{ width: "100%", mt: 4, p: { xs: 1, sm: 2 } }}>
          <TableContainer sx={{ maxHeight: 320, overflowY: "auto", overflowX: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 400 }} size="small" aria-label="pending users table">
              <TableHead>
                <TableRow>
                  <TableCell variant="head" align="left" sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 50 }}>ID</TableCell>
                  <TableCell variant="head" align="left" sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 120, wordBreak: "break-word", whiteSpace: "pre-line" }}>Username</TableCell>
                  <TableCell variant="head" align="left" sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 120, wordBreak: "break-word", whiteSpace: "pre-line" }}>Roles</TableCell>
                  <TableCell variant="head" align="left" sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.filter(user => user.approvalStatus === "PENDING").map(user => (
                  <TableRow key={user.id}>
                    <TableCell align="left" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>{user.id}</TableCell>
                    <TableCell align="left" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>{user.username}</TableCell>
                    <TableCell align="left" sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>{user.roles.join(", ")}</TableCell>
                    <TableCell align="left">
                      <Button onClick={() => handleFillFields(user)}>Select</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Card>
    </Box>
  );
};

export default AddUser;
