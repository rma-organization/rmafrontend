import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../services/api/axios"; // ✅ Use centralized axios instance

const AddCustomer = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/api/customers");
        setVendors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setVendors([]);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value || "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage("");
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Customer name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/api/customers", formData);
      setVendors((prev) => [...prev, response.data]);
      setFormData({ name: "" });
      setSuccessMessage("Customer added successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    setDeletingVendorId(customerId);
    setError(null);
    setSuccessMessage("");
    try {
      await axiosInstance.delete(`/api/customers/${customerId}`);
      setVendors((prevVendors) => prevVendors.filter((customer) => customer.id !== customerId));
      setSuccessMessage("Customer deleted successfully!");
    } catch (error) {
      setError(error.response?.data || "Failed to delete customer. Please try again.");
    } finally {
      setDeletingVendorId(null);
    }
  };

  return (
    <Box p={2} mt={8}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black" mb={2}>
          Add Customer
        </Typography>

        <Button variant="contained" disableElevation component={Link} to="/ListInventoryComponent" sx={{ mb: 2 }}>
          Back
        </Button>

        <Paper sx={{ padding: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} alignItems="center">
              <Box flex={1}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" sx={{ width: "35%", minWidth: "120px" }}>
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Box>
              </Box>

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "blue", color: "white" }}
                  disableElevation
                  disabled={loading}
                >
                  {loading ? "Adding Customer..." : "Add Customer"}
                </Button>
              </Box>
            </Box>

            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}

            {successMessage && (
              <Typography color="success.main" mt={2}>
                {successMessage}
              </Typography>
            )}
          </form>
        </Paper>

        <Paper sx={{ padding: 3, mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" color="black" mb={2}>
            Existing Customers
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="customer table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="right">Customer Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell component="th" scope="row">
                      {vendor.id}
                    </TableCell>
                    <TableCell align="right">{vendor.name}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(vendor.id)}
                        disabled={deletingVendorId === vendor.id}
                      >
                        {deletingVendorId === vendor.id ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCustomer;
