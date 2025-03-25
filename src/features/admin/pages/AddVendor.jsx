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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddVendor = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState(null);

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
    setFormData({ ...formData, [event.target.name]: event.target.value || "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Vendor name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/vendors`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setVendors((prev) => [...prev, response.data]);
      setFormData({ name: "" });
      navigate("/SuccessfullyAddVendor");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add vendor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    setDeletingVendorId(vendorId);
    try {
      await axios.delete(`${apiUrl}/api/vendors/${vendorId}`);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      setError(error.response?.data || "Failed to delete vendor. Please try again.");
    } finally {
      setDeletingVendorId(null);
    }
  };

  return (
    <Box p={2} mt={8}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black">
          Add Vendor
        </Typography>

        <Button variant="contained" disableElevation component={Link} to="/ListInventoryComponent">
          Back
        </Button>

        <Paper sx={{ padding: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
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
                  />
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
                disabled={loading}
              >
                {loading ? "Adding Vendor..." : "Add Vendor"}
              </Button>
            </Box>
          </form>
        </Paper>

        <Paper sx={{ padding: 3, mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" color="black" mb={2}>
            Existing Vendors
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="vendor table">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="right">Vendor Name</TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddVendor;
