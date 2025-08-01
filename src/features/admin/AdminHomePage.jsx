import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent, Avatar, Divider } from "@mui/material";
import { People, AssignmentInd, PendingActions } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchAllUsers } from "../../services/api/authService";

const AdminHomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchAllUsers();
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    loadUsers();
  }, []);

  const approvalStatusCounts = {};
  const roleCounts = {};

  users.forEach((user) => {
    const status = user.approvalStatus || "Unknown";
    approvalStatusCounts[status] = (approvalStatusCounts[status] || 0) + 1;

    if (user.approvalStatus === "APPROVED") {
      if (Array.isArray(user.roles)) {
        user.roles.forEach((role) => {
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
      } else {
        const singleRole = user.roles || "Unknown";
        roleCounts[singleRole] = (roleCounts[singleRole] || 0) + 1;
      }
    }
  });

  const approvalChartData = Object.entries(approvalStatusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const roleChartData = Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
  }));

  const totalUsers = users.filter(user => user.approvalStatus === "APPROVED").length;
  const totalRoles = Object.keys(roleCounts).length;
  const pendingApprovals = users.filter(user => user.approvalStatus === "PENDING").length;

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
        boxSizing: 'border-box',
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          boxShadow: 6,
          display: "flex",
          flexDirection: "column",
          overflow: "auto"
        }}
      >
        <Grid container alignItems="center" spacing={2} mb={2}>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome Admin!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here is today's dashboard overview
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, borderLeft: "6px solid #1976d2" }}>
              <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                <People />
              </Avatar>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" color="text.secondary">Total Users</Typography>
                <Typography variant="h5" fontWeight="bold">{totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, borderLeft: "6px solid #82ca9d" }}>
              <Avatar sx={{ bgcolor: "#82ca9d", mr: 2 }}>
                <AssignmentInd />
              </Avatar>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" color="text.secondary">Total Roles</Typography>
                <Typography variant="h5" fontWeight="bold">{totalRoles}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, borderLeft: "6px solid #ff9800" }}>
              <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                <PendingActions />
              </Avatar>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" color="text.secondary">Pending Approvals</Typography>
                <Typography variant="h5" fontWeight="bold">{pendingApprovals}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: 370 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                User Approval Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={approvalChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: 370 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                User Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminHomePage;
