import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
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
import { listRequests } from "../../../services/api/RequestServices";
//import { listRequests } from "../../../services/api/InventoryServices";
//import { searchInventoryBySerial } from "../../../services/api/axios";
import { searchInventoryBySerial } from "../../../services/api/commonService";
import jwtDecode from "jwt-decode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EngineerHomePage() {
  const [userName, setUserName] = useState("User");
  const [chartData, setChartData] = useState({
    labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
    datasets: [
      {
        label: "Approved Requests",
        backgroundColor: "green",
        data: [0, 0, 0, 0],
      },
      {
        label: "Declined Requests",
        backgroundColor: "red",
        data: [0, 0, 0, 0],
      },
      {
        label: "Pending Requests",
        backgroundColor: "orange",
        data: [0, 0, 0, 0],
      },
      {
        label: "Faulty Returned",
        backgroundColor: "goldenrod",
        data: [0, 0, 0, 0],
      },
    ],
  });
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded?.sub || decoded?.username || "User");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await listRequests();
        if (!data || data.length === 0) return setLoading(false);

        const earliestDate = new Date(
          Math.min(...data.map((req) => new Date(req.createdAt).getTime()))
        );
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

        data.forEach((req) => {
          const date = new Date(req.createdAt);
          const weekIndex = Math.floor((date - startDate) / (7 * 24 * 60 * 60 * 1000));
          if (weekIndex >= 0 && weekIndex < 4) {
            switch (req.status) {
              case "Approved":
                weeklyCounts.Approved[weekIndex]++;
                break;
              case "Declined":
                weeklyCounts.Declined[weekIndex]++;
                break;
              case "Requested":
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

        setChartData({
          labels: ["First Week", "Second Week", "Third Week", "Fourth Week"],
          datasets: [
            {
              label: "Approved Requests",
              backgroundColor: "green",
              data: weeklyCounts.Approved,
            },
            {
              label: "Declined Requests",
              backgroundColor: "red",
              data: weeklyCounts.Declined,
            },
            {
              label: "Pending Requests",
              backgroundColor: "orange",
              data: weeklyCounts.Pending,
            },
            {
              label: "Faulty Returned",
              backgroundColor: "goldenrod",
              data: weeklyCounts["Faulty Returned"],
            },
          ],
        });

        setError("");
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.trim().length > 0) {
        try {
          const results = await searchInventoryBySerial(value.trim());
          setSearchResults(results);
          if (inputRef.current) setMenuAnchorEl(inputRef.current);
        } catch (err) {
          console.error("Search failed:", err);
          setSearchResults([]);
          setMenuAnchorEl(null);
        }
      } else {
        setSearchResults([]);
        setMenuAnchorEl(null);
      }
    }, 300);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ backgroundColor: "#E0E0E0", minHeight: "100vh", py: 3, px: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome {userName} 👋
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search In-box Serial Number"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: "white", borderRadius: 2, mb: 2 }}
        aria-controls={menuAnchorEl ? "search-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(menuAnchorEl) ? "true" : undefined}
      />

      {/* Search Result Dropdown */}
      <Menu
        id="search-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl) && searchResults.length > 0}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: inputRef.current ? inputRef.current.clientWidth : 300,
            borderRadius: 8,
          },
        }}
      >
        {searchResults.slice(0, 5).map((item) => (
          <MenuItem key={item.id} onClick={handleMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Serial: {item.inBoxSerialNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Status: {item.status}
              </Typography>
              <Typography variant="body2">{item.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Chart Section */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box display="flex" justifyContent="center" mt={4}>
          <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
            <Box flex={3} sx={{ height: "60vh", width: "100%" }}>
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
                }}
              />
            </Box>
            <Box flex={1} ml={4}>
              <Typography fontWeight="bold">Duration: {duration}</Typography>
              {["green", "red", "orange", "goldenrod"].map((color, i) => (
                <Box key={color} display="flex" alignItems="center" mt={1}>
                  <Box width={12} height={12} bgcolor={color} mr={1} />
                  {
                    ["Approved Requests", "Declined Requests", "Pending Requests", "Faulty Returned"][i]
                  }
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
