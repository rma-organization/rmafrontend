import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

const RequestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get request ID for editing

  const [formData, setFormData] = useState({
    name: "",
    status: "Requested", // Default value should match one of the options
    partId: "",
    vendor: "",
    srNumber: "",
    fieldServiceTaskNumber: "",
    faultPartNumber: "",
    mailIds: "",
    customer: "",
    requestedUserId: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  });

  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // To show loading indicator
  const [error, setError] = useState(null); // To handle errors

  // Fetch vendors, customers, and existing request data if editing
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading state

      try {
        const vendorRes = await fetch("http://localhost:8080/api/vendors");
        const customerRes = await fetch("http://localhost:8080/api/customers");

        if (vendorRes.ok && customerRes.ok) {
          const vendorData = await vendorRes.json();
          const customerData = await customerRes.json();

          setVendors(vendorData);
          setCustomers(customerData);

          if (!id) {
            setFormData((prev) => ({
              ...prev,
              vendor: vendorData.length > 0 ? vendorData[0].id : "",
              customer: customerData.length > 0 ? customerData[0].id : "",
            }));
          }
        } else {
          setError("Failed to load vendors or customers.");
        }

        if (id) {
          const requestRes = await fetch(`http://localhost:8080/api/requests/${id}`);
          if (requestRes.ok) {
            const requestData = await requestRes.json();
            setFormData(requestData);
          } else {
            setError("Failed to load request details.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data before submitting
  const validateForm = () => {
    if (!formData.name || !formData.vendor || !formData.customer) {
      return "Name, Vendor, and Customer are required.";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const requestBody = {
      ...formData,
      vendor: {
        id: formData.vendor ? parseInt(formData.vendor, 10) : null,
      },
      customer: {
        id: formData.customer ? parseInt(formData.customer, 10) : null,
      },
      requestedUserId: formData.requestedUserId
        ? parseInt(formData.requestedUserId, 10)
        : null,
      updatedAt: new Date().toISOString(),
    };

    if (!id) {
      requestBody.createdAt = new Date().toISOString();
    }

    try {
      const url = id
        ? `http://localhost:8080/api/requests/${id}`
        : "http://localhost:8080/api/requests";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Request submitted successfully!");
        navigate(-1);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);  // Log the full response
        console.error("Errors:", errorData.errors);  // Log the specific errors from the server
        alert("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 3,
        p: 2,
        bgcolor: "#FFFBFB",
        borderRadius: 2,
        boxShadow: 2,
        border: "1px solid #ECE7E7",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#ECE7E7",
          p: 1.5,
          borderRadius: "8px 8px 0 0",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
          {id ? "Edit Request" : "Add New Request"}
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#2715E6",
            color: "#FFFFFF",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": { bgcolor: "#1F10C8" },
          }}
        >
          ← Back
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
                required
              />
              <TextField
                fullWidth
                select
                size="small"
                label="Vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
                required
              >
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                size="small"
                label="Customer"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                label="SR Number"
                name="srNumber"
                value={formData.srNumber}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Field Service Task Number"
                name="fieldServiceTaskNumber"
                value={formData.fieldServiceTaskNumber}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Fault Part Number"
                name="faultPartNumber"
                value={formData.faultPartNumber}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Email ID"
                name="mailIds"
                value={formData.mailIds}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                sx={{ mb: 1.5 }}
              />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#E0E0E0" }} />

            <Box sx={{ flex: 0.4 }}>
              <TextField
                fullWidth
                size="small"
                label="Part Number"
                name="partId"
                value={formData.partId}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
            </Box>
          </Box>

          <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
            {id ? "Update Request" : "Request Part"}
          </Button>
        </form>
      )}
    </Container>
  );
};

export default RequestPage;
