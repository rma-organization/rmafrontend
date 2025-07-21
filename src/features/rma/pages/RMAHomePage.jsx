import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment, useMediaQuery } from "@mui/material";
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

import axiosInstance from "../../../services/api/axios";

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
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    <Box sx={{ 
      backgroundColor: "#E0E0E0", 
      height: "100vh", // Changed from minHeight to fixed height
      py: 3, 
      px: isMobile ? 2 : 5,
      overflow: "hidden", // Changed from overflowX to overflow
      display: "flex",
      flexDirection: "column"
    }}>
      <Box sx={{ flex: "0 0 auto" }}>
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
          sx={{ 
            backgroundColor: "white", 
            borderRadius: 2, 
            mb: 2 
          }}
        />
      </Box>

      <Box 
        sx={{ 
          flex: "1 1 auto",
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          alignItems: "center",
          gap: 2,
          overflow: "hidden"
        }}
      >
        <Box sx={{ 
          width: isMobile ? "100%" : "70%", 
          height: isMobile ? "60%" : "90%",
          minHeight: "250px",
          overflow: "hidden"
        }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  position: isMobile ? "bottom" : "top",
                }
              }
            }}
          />
        </Box>

        <Box sx={{ 
          width: isMobile ? "100%" : "30%",
          pl: isMobile ? 0 : 4,
          pt: isMobile ? 2 : 0,
          overflow: "hidden"
        }}>
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