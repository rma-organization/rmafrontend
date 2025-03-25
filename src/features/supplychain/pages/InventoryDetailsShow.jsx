import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getInventoryById } from "../../../services/api/InventoryServices";

// Styled TableCell component to customize styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const InventoryDetailsShow = () => {
  const { id } = useParams(); // Get inventory ID from the URL
  const [inventoryItem, setInventoryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Inventory Data by ID
  useEffect(() => {
    const fetchInventoryDetails = async () => {
      try {
        const response = await getInventoryById(id);
        setInventoryItem(response); // Set the inventory item data
        setError(null); // Reset error state
      } catch (error) {
        setError("Failed to fetch inventory details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryDetails();
  }, [id]);

  if (loading) {
    return (
      <Box p={2} mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2} mt={10}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Inventory List
        </Button>
      </Box>
    );
  }

  if (!inventoryItem) {
    return (
      <Box p={2} mt={10}>
        <Typography variant="h6" color="error">
          No inventory details found for ID: {id}.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Inventory List
        </Button>
      </Box>
    );
  }

  // Function to format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <Box p={2} mt={10}>
      {/* Inventory Section */}
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        {/* Title */}
        <Typography variant="h6" fontWeight="bold" color="black" mt={2}>
          Inventory Details
        </Typography>

        {/* Back Button */}
        <Button
          variant="contained"
          disableElevation
          component={Link}
          to="/InventoryManagement"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {/* Info Section */}
        <Paper sx={{ padding: 3, mt: 2 }}>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">Last Update</Typography>
            <Typography variant="h6">{formatDate(inventoryItem.updatedAt)}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">Status</Typography>
            <Typography variant="h6">{inventoryItem.status}</Typography>
          </Box>

          {/* First Table: Inventory Item Details */}
          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">Inventory Item Details</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Item Name</StyledTableCell>
                    <StyledTableCell>MIT Number</StyledTableCell>
                    <StyledTableCell>Part Number</StyledTableCell>
                    <StyledTableCell>Vendor</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Last Update</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{inventoryItem.name}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.mitNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inBoxPartNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.vendorName}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inventoryLocation}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.status}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.description || "No description"}</StyledTableCell>
                    <StyledTableCell>{formatDate(inventoryItem.updatedAt)}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Second Table: Additional Information */}
          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">Additional Information</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Item Type</StyledTableCell>
                    <StyledTableCell>PO Number</StyledTableCell>
                    <StyledTableCell>Lot Number</StyledTableCell>
                    <StyledTableCell>Box Part Number</StyledTableCell>
                    <StyledTableCell>In Box Serial Number</StyledTableCell>
                    <StyledTableCell>Box Serial Number</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{inventoryItem.quantity}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.itemType}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.poNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.lotNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.boxPartNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inBoxSerialNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.boxSerialNumber}</StyledTableCell>
                    <StyledTableCell>{formatDate(inventoryItem.createdAt)}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default InventoryDetailsShow;
