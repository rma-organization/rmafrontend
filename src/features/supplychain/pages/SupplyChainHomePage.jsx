import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../../services/api/axios";
import jwtDecode from "jwt-decode";  // <-- fixed import here

const COLORS = ["#4CAF50", "#F44336", "#FFC107", "#2196F3"];

const RequestStatusChart = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  // 🔐 Decode JWT and get username
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    axiosInstance
      .get("/api/requests")
      .then((response) => {
        const requests = response.data;

        const statusCount = {
          Approved: 0,
          Rejected: 0,
          "At Office": 0,
          "En Route": 0,
        };

        requests.forEach((request) => {
          if (request.status === "Approved") statusCount.Approved += 1;
          else if (request.status === "Rejected") statusCount.Rejected += 1;
          else if (request.status === "At Office") statusCount["At Office"] += 1;
          else if (request.status === "En Route") statusCount["En Route"] += 1;
        });

        setData([
          { name: "Approved", value: statusCount.Approved },
          { name: "Rejected", value: statusCount.Rejected },
          { name: "At Office", value: statusCount["At Office"] },
          { name: "En Route", value: statusCount["En Route"] },
        ]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box px={3} py={5} sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: 2,
          height: "80px",
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight="600" color="primary">
          Welcome, {userName}
        </Typography>
        <WavingHandIcon sx={{ color: "#ffca28", ml: 2, fontSize: 30 }} />
      </Box>

      {/* Search Bar */}
      <Box sx={{ mt: 4, mx: "auto", width: "100%", maxWidth: 500 }}>
        <Paper
          component="form"
          sx={{
            p: "6px 12px",
            display: "flex",
            alignItems: "center",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Requests"
            inputProps={{ "aria-label": "search requests" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Pie Chart */}
      <Card
        sx={{
          maxWidth: 500,
          mt: 5,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 3,
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
            Request Status Distribution
          </Typography>
          {loading ? (
            <Typography textAlign="center">Loading...</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { name, value } = payload[0];
                      const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);
                      const percentage = ((value / totalValue) * 100).toFixed(2);
                      return (
                        <Box
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Typography fontWeight="bold">{name}</Typography>
                          <Typography variant="body2">Value: {value}</Typography>
                          <Typography variant="body2">Percentage: {percentage}%</Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RequestStatusChart;
