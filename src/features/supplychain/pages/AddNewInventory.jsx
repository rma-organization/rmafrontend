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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddNewInventory = () => {
  const navigate = useNavigate();

  // State for form fields
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
  });

  const [error, setError] = useState(null); // Error state
  const [vendors, setVendors] = useState([]); // Vendor state
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080"; 

  // Fetch vendors when component mounts
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/vendors`);
        console.log("Fetched vendors:", response.data);

        //  Ensure response is an array
        setVendors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]); // Prevent issues with undefined state
      }
    };

    fetchVendors();
  }, [apiUrl]);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "", // Ensure controlled inputs
    }));
  };

  // Handle vendor dropdown change
  const handleSelectChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      vendorId: event.target.value,
    }));
  };

  // Handle status dropdown change
  const handleStatusChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      status: event.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    // Validation: Check if required fields are filled
    if (!formData.name || !formData.boxPartNumber || !formData.quantity || !formData.vendorId) {
      setError("Please fill in all required fields.");
      return;
    }

    // Convert necessary fields to correct types before sending
    const submissionData = {
      ...formData,
      quantity: Number(formData.quantity) || 0, // Ensure quantity is a number
    };

    try {
      const response = await axios.post(`${apiUrl}/api/inventory`, submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Part added:", response.data);

      // Reset the form after successful submission
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
      });

      // Redirect on success
      navigate("/SuccessfullyAddInventory");
    } catch (error) {
      console.error("Error adding part:", error.response ? error.response.data : error);
      setError(error.response?.data?.message || "Failed to add inventory. Please try again.");
    }
  };

  return (
    <Box p={2} mt={8}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black">
          Add New Part
        </Typography>

        <Button variant="contained" disableElevation component={Link} to="/InventoryManagement">
          Back
        </Button>

        <Paper sx={{ padding: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
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
                  { label: "Item Type", name: "itemType" },
                  { label: "PO Number", name: "poNumber" },
                  { label: "LOT Number", name: "lotNumber" },
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
                    <Select name="status" value={formData.status || ""} onChange={handleStatusChange} displayEmpty>
                      <MenuItem value="" disabled>Select Status</MenuItem>
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
                    <Select name="vendorId" value={formData.vendorId || ""} onChange={handleSelectChange} displayEmpty>
                      <MenuItem value="" disabled>Select Vendor</MenuItem>
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

            {/* Error Message */}
            {error && <Typography color="error" mt={2}>{error}</Typography>}

            {/* Add Part Button */}
            <Box mt={3}>
              <Button fullWidth type="submit" variant="contained" sx={{ backgroundColor: "blue", color: "white" }} disableElevation>
                Add Part
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddNewInventory;
