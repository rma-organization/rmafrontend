import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  const [formData, setFormData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/inventory/${id}`)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => console.error("Error fetching inventory:", err));

    axios.get(`${apiUrl}/api/vendors`)
      .then((res) => setVendors(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, [id, apiUrl]);

  const handleStatusChange = (e) => {
    setFormData((prevData) => ({ ...prevData, status: e.target.value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await axios.put(
        `${apiUrl}/api/inventory/${id}`,
        formData, // Send full object to prevent missing fields
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Status updated successfully!");
      navigate("/InventoryManagement");
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || "Failed to update status.");
    }
  };

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box p={2} mt={8}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black">
          Edit Inventory Status
        </Typography>
        <Button variant="contained" component={Link} to="/InventoryManagement">
          Back
        </Button>
        <Paper sx={{ padding: 3, mt: 2 }}>
          <form onSubmit={handleUpdate}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
              <Box flex={1}>
                {["name", "boxPartNumber", "inBoxPartNumber", "boxSerialNumber", "inBoxSerialNumber", "quantity", "inventoryLocation"].map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography sx={{ width: "35%", minWidth: "120px" }}>{field.replace(/([A-Z])/g, " $1")}</Typography>
                    <TextField fullWidth value={formData[field] || ""} disabled />
                  </Box>
                ))}
              </Box>
              <Box flex={1}>
                {["mitNumber", "itemType", "poNumber", "lotNumber", "description"].map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography sx={{ width: "35%", minWidth: "120px" }}>{field.replace(/([A-Z])/g, " $1")}</Typography>
                    <TextField fullWidth value={formData[field] || ""} disabled multiline={field === "description"} rows={field === "description" ? 3 : 1} />
                  </Box>
                ))}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography sx={{ width: "35%", minWidth: "120px" }}>Status</Typography>
                  <FormControl fullWidth>
                    <Select value={formData.status || ""} onChange={handleStatusChange}>
                      <MenuItem value="" disabled>Select Status</MenuItem>
                      <MenuItem value="Available">Available</MenuItem>
                      <MenuItem value="Not Available">Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography sx={{ width: "35%", minWidth: "120px" }}>Vendor</Typography>
                  <FormControl fullWidth>
                    <Select value={formData.vendorId || ""} disabled>
                      <MenuItem value="" disabled>Select Vendor</MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
            <Box mt={3}>
              <Button fullWidth type="submit" variant="contained" sx={{ backgroundColor: "blue", color: "white" }}>
                Update Status
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditInventory;


