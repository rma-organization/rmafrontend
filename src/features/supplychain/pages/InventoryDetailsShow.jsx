
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
import { getInventoryById, getVendors } from "../../../services/api/InventoryServices";

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
  const { id } = useParams();
  const [inventoryItem, setInventoryItem] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      try {
        const response = await getInventoryById(id);
        setInventoryItem(response.data);
        setError(null);
      } catch (error) {
        console.error("❌ Error fetching inventory details:", error);
        setError("Failed to fetch inventory details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryDetails();
  }, [id]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendors();
        setVendors(data);
      } catch (error) {
        console.error("❌ Error fetching vendors:", error);
        setVendors([]);
      }
    };

    fetchVendors();
  }, []);

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => String(v.id) === String(vendorId));
    return vendor ? vendor.name : "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

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

  return (
    <Box p={2} mt={10}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black" mt={2}>
          Inventory Details
        </Typography>

        <Button
          variant="contained"
          disableElevation
          component={Link}
          to="/InventoryManagement"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper sx={{ padding: 3, mt: 2 }}>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">
              Last Update
            </Typography>
            <Typography variant="h6">
              {formatDate(inventoryItem.updatedAt)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">
              Status
            </Typography>
            <Typography variant="h6">{inventoryItem.status}</Typography>
          </Box>

          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">
              Inventory Item Details
            </Typography>
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
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Last Update</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{inventoryItem.name}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.mitNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inBoxPartNumber}</StyledTableCell>
                    <StyledTableCell>{getVendorName(inventoryItem.vendorId)}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inventoryLocation}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.status}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.description || "No description"}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.quantity}</StyledTableCell>
                    <StyledTableCell>{formatDate(inventoryItem.updatedAt)}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">
              Additional Information
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Item Type</StyledTableCell>
                    <StyledTableCell>PO Number</StyledTableCell>
                    <StyledTableCell>Lot Number</StyledTableCell>
                    <StyledTableCell>Box Part Number</StyledTableCell>
                    <StyledTableCell>In Box Serial Number</StyledTableCell>
                    <StyledTableCell>Box Serial Number</StyledTableCell>
                    <StyledTableCell>Airway Bill Number</StyledTableCell>
                    <StyledTableCell>Currency</StyledTableCell>
                    <StyledTableCell>Amount</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{inventoryItem.itemType}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.poNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.lotNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.boxPartNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.inBoxSerialNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.boxSerialNumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.airwaybillnumber}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.currency}</StyledTableCell>
                    <StyledTableCell>{inventoryItem.amount}</StyledTableCell>
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
