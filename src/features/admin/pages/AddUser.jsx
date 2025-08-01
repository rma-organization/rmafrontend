
// export default AddUser;
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Button,
  Card, CardContent, Grid, TextField, Box,
  MenuItem, Select
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchPendingUsers, approveUser } from "../../../services/api/authService";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("PENDING");
  const navigate = useNavigate();

  // Load pending users on mount
  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        const res = await fetchPendingUsers();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setUsers([]);
      }
    };
    loadPendingUsers();
  }, []);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleFillFields = (user) => {
    setUsername(user.username);
    setStatus(user.approvalStatus);
  };

  const handleApproveUser = async () => {
    try {
      await approveUser(username, status);
      setUsers(users.filter(user => user.username !== username));
      setUsername("");
      setStatus("PENDING");
    } catch (error) {
      console.error("Error approving user:", error.message);
    }
  };

  return (
    <Box p={2} mt={1}>
      <Button variant="contained" disableElevation onClick={() => navigate("/admin-home")}>
        Home
      </Button>
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

        <Paper sx={{ width: "100%", mt: 4, p: { xs: 1, sm: 2 } }}>
          <TableContainer sx={{ maxHeight: 320, overflowY: "auto", overflowX: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 400 }} size="small" aria-label="pending users table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 50 }}>ID</TableCell>
                  <TableCell sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 120 }}>Username</TableCell>
                  <TableCell sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 120 }}>Roles</TableCell>
                  <TableCell sx={{ backgroundColor: "DarkGray", fontWeight: "bold", minWidth: 100 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.filter(u => u.approvalStatus === "PENDING").map(user => (
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
        </Paper>
      </Card>
    </Box>
  );
};

export default AddUser;
