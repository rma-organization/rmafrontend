

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Card, CardContent, Grid, TextField, Box,
  MenuItem, Select
} from "@mui/material";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/pending-users");
      const text = await response.text();

      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setUsers([]);
    }
  };

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleStatusChange = (event) => setStatus(event.target.value);

  const handleFillFields = (user) => {
    setUsername(user.username);
    setStatus(user.approvalStatus);
  };

  const handleApproveUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, approvalStatus: "APPROVED" }),
      });

      if (response.ok) {
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
    <Card sx={{ maxWidth: "1100px", margin: "auto", mt: 4, padding: "20px", backgroundColor: "#f5f5f5" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Approve User</Typography>
        </Box>

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

        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "blue", color: "white" }}
          onClick={handleApproveUser}
        >
          Approve User
        </Button>
      </CardContent>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.roles.join(", ")}</TableCell>
                <TableCell>
                  <Button onClick={() => handleFillFields(user)}>Select</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default AddUser;
