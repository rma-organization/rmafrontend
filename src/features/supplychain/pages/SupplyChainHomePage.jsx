
import React, { useState, useEffect, useRef } from "react";
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
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import SearchIcon from "@mui/icons-material/Search";
import jwtDecode from "jwt-decode";

// Import the API functions (assuming from your services directory)
import { searchInventoryBySerial } from "../../../services/api/InventoryServices";
import { listRequests } from "../../../services/api/RequestServices";

const COLORS = ["#4CAF50", "#F44336", "#FFC107", "#2196F3"];

const RequestStatusChart = () => {
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Decode JWT for greeting
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

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.trim().length > 0) {
        try {
          const results = await searchInventoryBySerial(value.trim());
          setSearchResults(results);
          if (inputRef.current) {
            setMenuAnchorEl(inputRef.current);
          }
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Fetch requests status counts
  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const requests = await listRequests();

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
      } catch (error) {
        console.error("Error fetching requests data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
        p: isMobile ? 2 : 4,
      }}
    >
      {/* Welcome Box */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: 2,
          height: 80,
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          alignItems: "center",
          px: 3,
          userSelect: "none",
          mb: isMobile ? 2 : 4,
        }}
      >
        <Typography variant="h5" fontWeight="600" color="primary">
          Welcome, {userName}
        </Typography>
        <WavingHandIcon sx={{ color: "#ffca28", ml: 2, fontSize: 30 }} />
      </Box>

      {/* Search Box */}
      <Box sx={{ width: "100%", maxWidth: 500, mb: isMobile ? 2 : 4 }}>
        <Paper
          component="form"
          sx={{
            p: "6px 12px",
            display: "flex",
            alignItems: "center",
            borderRadius: 3,
            boxShadow: 1,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search In-box Serial Number"
            inputProps={{ "aria-label": "search serial number" }}
            value={searchQuery}
            onChange={handleSearchChange}
            inputRef={inputRef}
            aria-controls={menuAnchorEl ? "search-results-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(menuAnchorEl) ? "true" : undefined}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Search Results Menu */}
        <Menu
          id="search-results-menu"
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
      </Box>

      {/* Pie Chart */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 0,
              py: 1,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              textAlign="center"
              sx={{ mb: isMobile ? 1 : 2 }}
            >
              Request Status Distribution
            </Typography>
            {loading ? (
              <Typography textAlign="center">Loading...</Typography>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: 250,
                  maxHeight: 350,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const { name, value } = payload[0];
                          const totalValue = data.reduce(
                            (acc, entry) => acc + entry.value,
                            0
                          );
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
                              <Typography variant="body2">
                                Percentage: {percentage}%
                              </Typography>
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{
                        paddingTop: isMobile ? 10 : 20,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RequestStatusChart;
