import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
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
import axiosInstance from "../../../services/api/axios"; // ✅ Make sure path is correct

const COLORS = ["#28a745", "#dc3545", "#6f42c1", "#007bff"];

const RequestStatusChart = ({ userName = "User" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Box p={2} mt={5}>
      {/* Welcome Banner */}
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
          Welcome, {userName}
        </Typography>
        <WavingHandIcon sx={{ color: "gold", ml: 2 }} />
      </Box>

      {/* Search Bar */}
      <Box sx={{ mx: "auto", mt: 5, width: "fit-content" }}>
        <Paper
          component="form"
          sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
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
          width: "100%",
          maxWidth: 400,
          p: 2,
          textAlign: "center",
          mx: "auto",
          mt: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Request Status
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
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
                      <div className="custom-tooltip" style={{ background: "white", padding: "8px", border: "1px solid #ccc" }}>
                        <strong>{name}</strong>
                        <div>{`Value: ${value}`}</div>
                        <div>{`Percentage: ${percentage}%`}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RequestStatusChart;
