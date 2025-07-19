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

  const [formData, setFormData] = useState({});
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryRes = await axios.get(`${apiUrl}/api/inventory/${id}`);
        setFormData(inventoryRes.data);

        const vendorsRes = await axios.get(`${apiUrl}/api/vendors`);
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, apiUrl]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await axios.put(`${apiUrl}/api/inventory/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Inventory updated successfully!");
      navigate("/InventoryManagement");
    } catch (error) {
      console.error("Error updating inventory:", error);
      setError(error.response?.data?.message || "Failed to update inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatLabel = (label) =>
    label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  if (loading) return <Typography>Loading...</Typography>;

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
                {[
                  "name",
                  "boxPartNumber",
                  "inBoxPartNumber",
                  "boxSerialNumber",
                  "inBoxSerialNumber",
                  "quantity",
                  "inventoryLocation",
                  "airwaybillnumber",
                  "amount",
                ].map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography sx={{ width: "35%", minWidth: "120px" }}>
                      {formatLabel(field)}
                    </Typography>
                    <TextField
                      fullWidth
                      type={["quantity", "amount"].includes(field) ? "number" : "text"}
                      value={formData[field] ?? ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
              <Box flex={1}>
                {["currency", "mitNumber", "itemType", "poNumber", "lotNumber", "description"].map(
                  (field, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Typography sx={{ width: "35%", minWidth: "120px" }}>
                        {formatLabel(field)}
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData[field] ?? ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        multiline={field === "description"}
                        rows={field === "description" ? 3 : 1}
                      />
                    </Box>
                  )
                )}

                {/* Status Select */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography sx={{ width: "35%", minWidth: "120px" }}>Status</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.status || ""}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Select Status
                      </MenuItem>
                      <MenuItem value="Available">Available</MenuItem>
                      <MenuItem value="Not Available">Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Vendor Select */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography sx={{ width: "35%", minWidth: "120px" }}>Vendor</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.vendorId || ""}
                      onChange={(e) => handleInputChange("vendorId", e.target.value)}
                    >
                      <MenuItem value="" disabled>
                        Select Vendor
                      </MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </MenuItem>
                      ))}
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
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Inventory"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditInventory;
