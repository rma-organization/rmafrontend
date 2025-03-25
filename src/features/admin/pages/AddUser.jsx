import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const roleMapping = {
  ADMIN: "System Admin",
  ENGINEER: "Engineer",
  SUPPLYCHAIN: "Supply Chain Team",
  RMA: "RMA",
};

const AddUser = () => {
  const [users, setUsers] = useState([]); // Ensures initial value is an array
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [options, setOptions] = useState({
    systemadmin: false,
    supplychain: false,
    engineer: false,
    rma: false,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/pending-users")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Debugging log
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected API response format:", data);
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setUsers([]);
      });
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleChange = (event) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleFillFields = (user) => {
    setUsername(user.username);
    setEmail(user.email);

    // Convert backend role names to frontend role states
    const userRoles = user.roles.map((role) => roleMapping[role] || role);

    setOptions({
      systemadmin: userRoles.includes("System Admin"),
      supplychain: userRoles.includes("Supply Chain Team"),
      engineer: userRoles.includes("Engineer"),
      rma: userRoles.includes("RMA"),
    });
  };

  return (
    <Card sx={{ maxWidth: "1100px", margin: "auto", mt: 4, padding: "20px", backgroundColor: "#f5f5f5" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{ backgroundColor: "blue", color: "white", textTransform: "none", borderRadius: "0px", mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6">Add New User</Typography>
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
            <TextField
              label="Email ID"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Role:</Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormControlLabel
                control={<Checkbox name="systemadmin" checked={options.systemadmin} onChange={handleChange} />}
                label="System Admin"
              />
              <FormControlLabel
                control={<Checkbox name="supplychain" checked={options.supplychain} onChange={handleChange} />}
                label="Supply Chain Team"
              />
              <FormControlLabel
                control={<Checkbox name="engineer" checked={options.engineer} onChange={handleChange} />}
                label="Engineer"
              />
              <FormControlLabel
                control={<Checkbox name="rma" checked={options.rma} onChange={handleChange} />}
                label="RMA"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "blue", color: "white", fontWeight: "bold", fontSize: "16px" }}
            >
              Add New User
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      {/* Scrollable Table */}
      <TableContainer component={Paper} sx={{ mt: 4, maxHeight: 300, overflow: "auto" }}>
        <Typography variant="h6" align="center" sx={{ my: 2 }}>Pending Users</Typography>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.roles.map((role) => roleMapping[role] || role).join(", ")}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleFillFields(user)}>
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default AddUser;