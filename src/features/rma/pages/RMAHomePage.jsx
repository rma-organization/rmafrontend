import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import axiosInstance from "../../../services/api/axios"; // adjust the path accordingly

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RMAHomePage() {
  const [chartData, setChartData] = useState({
    labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
    datasets: [
      { label: "RMA Collected", backgroundColor: "#D7B943", data: [0, 0, 0, 0] },
      { label: "RMA Completed", backgroundColor: "#008080", data: [0, 0, 0, 0] },
    ],
  });

  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use axiosInstance instead of fetch so token is included
        const response = await axiosInstance.get("/api/requests");
        const data = response.data;

        if (data.length === 0) return;

        const earliestDate = new Date(
          Math.min(...data.map((request) => new Date(request.createdAt).getTime()))
        );
        const startDate = new Date(earliestDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 28); // 4 weeks later

        setDuration(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

        const weeklyCounts = {
          Collected: [0, 0, 0, 0],
          Completed: [0, 0, 0, 0],
        };

        data.forEach((request) => {
          const requestDate = new Date(request.createdAt);
          const weekIndex = Math.floor((requestDate - startDate) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex >= 0 && weekIndex < 4) {
            switch (request.status) {
              case "Collected":
                weeklyCounts.Collected[weekIndex]++;
                break;
              case "Completed":
                weeklyCounts.Completed[weekIndex]++;
                break;
              default:
                break;
            }
          }
        });

        setChartData({
          labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
          datasets: [
            { label: "RMA Collected", backgroundColor: "#D7B943", data: weeklyCounts.Collected },
            { label: "RMA Completed", backgroundColor: "#008080", data: weeklyCounts.Completed },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 7 * 24 * 60 * 60 * 1000); // Update weekly
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ backgroundColor: "#E0E0E0", minHeight: "100vh", py: 3, px: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome RMA Manager 👋
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search..."
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: "white", borderRadius: 2, mb: 2 }}
      />

      <Box sx={{ mt: 10 }} />

      <Box display="flex" alignItems="center">
        <Box flex={3} sx={{ width: "90%", height: "350px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </Box>

        <Box flex={1} ml={4}>
          <Typography fontWeight="bold">Duration: {duration}</Typography>
          {["#D7B943", "#008080"].map((color, i) => (
            <Box key={color} display="flex" alignItems="center" mt={1}>
              <Box width={12} height={12} bgcolor={color} mr={1} />
              {["RMA Collected", "RMA Completed"][i]}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
