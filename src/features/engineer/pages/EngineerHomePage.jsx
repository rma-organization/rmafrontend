import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Autocomplete,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EngineerHomePage() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);

  // Fetch all requests data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/requests");
        const data = await response.json();
        setAllRequests(data);

        if (data.length === 0) return;

        // Process data for chart
        const earliestDate = new Date(
          Math.min(
            ...data.map((request) => new Date(request.createdAt || new Date()).getTime())
          )
        );
        const startDate = new Date(earliestDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 28);
        setDuration(
          `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
        );

        const weeklyCounts = {
          Approved: [0, 0, 0, 0],
          Declined: [0, 0, 0, 0],
          Pending: [0, 0, 0, 0],
          "Faulty Returned": [0, 0, 0, 0],
        };

        data.forEach((request) => {
          const requestDate = new Date(request.createdAt || new Date());
          const weekIndex = Math.floor(
            (requestDate - startDate) / (7 * 24 * 60 * 60 * 1000)
          );
          if (weekIndex >= 0 && weekIndex < 4) {
            switch (request.status) {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle search functionality using the inventory search API
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/inventory/search?query=${encodeURIComponent(value)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search API error:", error);
      setSearchError("Failed to fetch search results");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#E0E0E0", minHeight: "100vh", py: 3, px: 5 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome Suranjan Nayanjith 👋
      </Typography>

      {/* Search Bar connected to inventory search API */}
      <Autocomplete
        freeSolo
        options={searchResults}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          // Adjust these fields based on your actual API response structure
          return `${option.inBoxPartNumber || option.boxPartNumber || 'No Part Number'} | 
                  ${option.description || 'No Description'} | 
                  ${option.status || 'No Status'}`;
        }}
        inputValue={searchTerm}
        onInputChange={(event, newValue) => {
          handleSearch(newValue);
        }}
        loading={searchLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search inventory by part number, description..."
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {searchLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 2, 
              mb: 2,
              "& .MuiOutlinedInput-root": {
                paddingLeft: "10px",
              }
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id || option.boxPartNumber}>
            <Box>
              <Typography fontWeight="bold">
                {option.inBoxPartNumber || option.boxPartNumber || 'No Part Number'}
              </Typography>
              <Box display="flex" flexDirection="column">
                {option.description && (
                  <Typography variant="body2">{option.description}</Typography>
                )}
                {option.status && (
                  <Typography variant="body2">Status: {option.status}</Typography>
                )}
                {option.quantityAvailable && (
                  <Typography variant="body2">
                    Available: {option.quantityAvailable}
                  </Typography>
                )}
              </Box>
            </Box>
          </li>
        )}
        noOptionsText={
          searchTerm.length < 2 
            ? "Type at least 2 characters to search" 
            : searchLoading 
              ? "Searching..." 
              : "No matching inventory items found"
        }
      />

      {searchError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {searchError}
        </Typography>
      )}

      {/* Spacer */}
      <Box sx={{ mt: 10 }} />

      {/* Chart & Legend Container */}
      <Box display="flex" alignItems="center">
        {/* Chart Box */}
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

        {/* Legend Box */}
        <Box flex={1} ml={4}>
          <Typography fontWeight="bold">Duration: {duration}</Typography>
          {["green", "red", "orange", "goldenrod"].map((color, i) => (
            <Box key={color} display="flex" alignItems="center" mt={1}>
              <Box width={12} height={12} bgcolor={color} mr={1} />
              {[
                "Approved Requests",
                "Declined Requests",
                "Pending Requests",
                "Faulty Returned",
              ][i]}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}