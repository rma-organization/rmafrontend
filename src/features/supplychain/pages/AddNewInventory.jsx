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
  Snackbar,
  Alert,
} from "@mui/material";  // Added Snackbar and Alert

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddNewInventory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    boxPartNumber: "",
    inBoxPartNumber: "",
    boxSerialNumber: "",
    inBoxSerialNumber: "",
    quantity: "",
    inventoryLocation: "",
    mitNumber: "",
    itemType: "",
    poNumber: "",
    lotNumber: "",
    status: "",
    description: "",
    vendorId: "",
    amount: "",
    currency: "",
    airwaybillnumber: "",
  });

  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false); // <-- Notification state
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/vendors`);
        setVendors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      }
    };
    fetchVendors();
  }, [apiUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.name || !formData.boxPartNumber || !formData.quantity || !formData.vendorId) {
      setError("Please fill in all required fields.");
      return;
    }

    const submissionData = {
      ...formData,
      quantity: Number(formData.quantity) || 0,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/inventory`, submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Part added:", response.data);

      // Clear form
      setFormData({
        name: "",
        boxPartNumber: "",
        inBoxPartNumber: "",
        boxSerialNumber: "",
        inBoxSerialNumber: "",
        quantity: "",
        inventoryLocation: "",
        mitNumber: "",
        itemType: "",
        poNumber: "",
        lotNumber: "",
        status: "",
        description: "",
        vendorId: "",
        amount: "",
        currency: "",
        airwaybillnumber: "",
      });

      // Show notification
      setNotificationOpen(true);

      // Optional: navigate after delay if you want
      // setTimeout(() => navigate("/SuccessfullyAddInventory"), 3000);
      // Or just keep as is, navigate immediately:
      navigate("/SuccessfullyAddInventory");

    } catch (error) {
      console.error("Error adding part:", error.response ? error.response.data : error);
      setError(error.response?.data?.message || "Failed to add inventory. Please try again.");
    }
  };

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotificationOpen(false);
  };

  return (
    <Box p={1} mt={8}>
      <Box bgcolor="lightgray" p={1} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black">
          Add New Part
        </Typography>

        <Button variant="contained" disableElevation component={Link} to="/InventoryManagement">
          Back
        </Button>

        <Paper sx={{ padding: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            {/* Your existing form layout (no changes) */}
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
              {/* Left Column */}
              <Box flex={1}>
                {[
                  { label: "Name", name: "name" },
                  { label: "Box Part Number", name: "boxPartNumber" },
                  { label: "In Box Part Number", name: "inBoxPartNumber" },
                  { label: "Box Serial Number", name: "boxSerialNumber" },
                  { label: "In Box Serial Number", name: "inBoxSerialNumber" },
                  { label: "QTY", name: "quantity" },
                  { label: "Inventory Location", name: "inventoryLocation" },
                  { label: "MIT Reference Number", name: "mitNumber" },
                  { label: "Item Type", name: "itemType" },
                ].map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" sx={{ width: "35%", minWidth: "120px" }}>
                      {field.label}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  </Box>
                ))}
              </Box>

              {/* Right Column */}
              <Box flex={1}>
                {[
                  { label: "PO Number", name: "poNumber" },
                  { label: "LOT Number", name: "lotNumber" },
                  { label: "Airway Bill Number", name: "airwaybillnumber" },
                  { label: "Currency", name: "currency" },
                  { label: "Amount", name: "amount" },
                  { label: "Description", name: "description" },
                ].map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" sx={{ width: "35%", minWidth: "120px" }}>
                      {field.label}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      multiline={field.name === "description"}
                      rows={field.name === "description" ? 3 : 1}
                    />
                  </Box>
                ))}

                {/* Status Dropdown */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" sx={{ width: "35%", minWidth: "120px" }}>
                    Status
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
                      <MenuItem value="Available">Available</MenuItem>
                      <MenuItem value="Not Available">Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Vendor Dropdown */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" sx={{ width: "35%", minWidth: "120px" }}>
                    Vendor
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      name="vendorId"
                      value={formData.vendorId || ""}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Vendor
                      </MenuItem>
                      {Array.isArray(vendors) && vendors.length > 0 ? (
                        vendors.map((vendor) => (
                          <MenuItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Vendors Available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}

            <Box mt={3}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "blue", color: "white" }}
                disableElevation
              >
                Add Part
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleNotificationClose} severity="success" sx={{ width: "100%" }}>
          Part added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddNewInventory;
