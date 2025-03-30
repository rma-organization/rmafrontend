import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HomePage() {
  const [chartData, setChartData] = useState({
    labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
    datasets: [
      { label: "Approved Requests", backgroundColor: "green", data: [0, 0, 0, 0] },
      { label: "Declined Requests", backgroundColor: "red", data: [0, 0, 0, 0] },
      { label: "Pending Requests", backgroundColor: "orange", data: [0, 0, 0, 0] },
      { label: "Faulty Returned", backgroundColor: "goldenrod", data: [0, 0, 0, 0] },
    ],
  });

  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/requests");
        const data = await response.json();
        
        const validRequests = data.filter(request => request.createdAt);
        if (validRequests.length === 0) return;
        
        const earliestDate = new Date(Math.min(...validRequests.map(request => new Date(request.createdAt).getTime())));
        const startDate = new Date(earliestDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 28);

        setDuration(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

        const weeklyCounts = {
          Approved: [0, 0, 0, 0],
          Declined: [0, 0, 0, 0],
          Pending: [0, 0, 0, 0],
          "Faulty Returned": [0, 0, 0, 0],
        };

        data.forEach((request) => {
          const requestDate = new Date(request.createdAt);
          const weekIndex = Math.floor((requestDate - startDate) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex >= 0 && weekIndex < 4) {
            switch (request.status) {
              case "Approved":
                weeklyCounts.Approved[weekIndex]++;
                break;
              case "Declined":
                weeklyCounts.Declined[weekIndex]++;
                break;
              case "Requested":
              case "Pending":
                weeklyCounts.Pending[weekIndex]++;
                break;
              case "Faulty Returned":
                weeklyCounts["Faulty Returned"][weekIndex]++;
                break;
              default:
                break;
            }
          }
        });

        const maxY = Math.max(...Object.values(weeklyCounts).flat()) || 5;

        setChartData({
          labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
          datasets: [
            { label: "Approved Requests", backgroundColor: "green", data: weeklyCounts.Approved },
            { label: "Declined Requests", backgroundColor: "red", data: weeklyCounts.Declined },
            { label: "Pending Requests", backgroundColor: "orange", data: weeklyCounts.Pending },
            { label: "Faulty Returned", backgroundColor: "goldenrod", data: weeklyCounts["Faulty Returned"] },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ backgroundColor: "#E0E0E0", minHeight: "100vh", py: 3, px: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome Suranjan Nayanjith 👋
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
        <Box flex={3} sx={{ width: '90%', height: '350px' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: Math.max(...chartData.datasets.flatMap(d => d.data), 5),
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </Box>

        <Box flex={1} ml={4}>
          <Typography fontWeight="bold">Duration: {duration}</Typography>
          {["green", "red", "orange", "goldenrod"].map((color, i) => (
            <Box key={color} display="flex" alignItems="center" mt={1}>
              <Box width={12} height={12} bgcolor={color} mr={1} />
              {["Approved Requests", "Declined Requests", "Pending Requests", "Faulty Returned"][i]}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
