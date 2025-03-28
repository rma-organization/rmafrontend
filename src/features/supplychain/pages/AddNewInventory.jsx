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
import axios from "axios";

// Pie chart data structure for inventory categories
const COLORS = ["#28a745", "#dc3545", "#ffc107", "#007bff"];

const AddNewInventory = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [data, setData] = useState([]); // State to hold the inventory category data
  const [loading, setLoading] = useState(true); // State for loading status

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  // Fetch inventory data from the API on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/inventory")
      .then((response) => {
        const inventory = response.data; // Assuming API returns an array of inventory items
        const categoryCount = {
          Electronics: 0,
          Furniture: 0,
          Clothing: 0,
          Accessories: 0,
        };

        // Calculate counts for each category
        inventory.forEach((item) => {
          if (item.category === "Electronics") categoryCount.Electronics += 1;
          else if (item.category === "Furniture") categoryCount.Furniture += 1;
          else if (item.category === "Clothing") categoryCount.Clothing += 1;
          else if (item.category === "Accessories") categoryCount.Accessories += 1;
        });

        // Update the state with the calculated counts
        setData([
          { name: "Electronics", value: categoryCount.Electronics },
          { name: "Furniture", value: categoryCount.Furniture },
          { name: "Clothing", value: categoryCount.Clothing },
          { name: "Accessories", value: categoryCount.Accessories },
        ]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
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
          Welcome to Inventory Management
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
            placeholder="Search Inventory"
            inputProps={{ "aria-label": "search inventory" }}
            value={searchQuery} // Controlled input
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
            Inventory Category Distribution
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
              {/* Custom Tooltip for showing percentage */}
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { name, value } = payload[0];
                    const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);
                    const percentage = ((value / totalValue) * 100).toFixed(2);
                    return (
                      <div className="custom-tooltip">
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

export default AddNewInventory;
