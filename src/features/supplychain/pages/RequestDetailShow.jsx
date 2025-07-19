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
import { Link, useParams } from "react-router-dom";

// Styled Components for Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RequestDetailShow = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/requests/${id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available</Typography>;

  return (
    <Box p={2} mt={10}>
      {/* Inventory Section */}
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        {/* Title */}
        <Typography variant="h6" fontWeight="bold" color="black" mt={2}>
          Request Details
        </Typography>

        {/* Back Button */}
        <Button
          variant="contained"
          disableElevation
          component={Link}
          to="/ListInventoryComponent"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        {/* Info Section */}
        <Paper sx={{ padding: 3, mt: 2 }}>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">Last Update</Typography>
            <Typography variant="h6">{new Date(data.updatedAt).toLocaleDateString()}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" fontWeight="bold">Status</Typography>
            <Typography variant="h6">{data.status}</Typography>
          </Box>

          {/* First Table: Inventory Items */}
          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">Request Item</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Item Name</StyledTableCell>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell>Vendor</StyledTableCell>
                    <StyledTableCell>SR Number</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">{data.name}</StyledTableCell>
                    <StyledTableCell>{data.customer?.name || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.vendor?.name || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.srNumber}</StyledTableCell>
                    <StyledTableCell>{data.mailIds}</StyledTableCell>
                    <StyledTableCell>{data.description || "No description"}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Second Table: Service Requests */}
          <Box mt={3} width={700}>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Fault Part Number</StyledTableCell>
                    <StyledTableCell>Field Service Task Number</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{data.faultPartNumber}</StyledTableCell>
                    <StyledTableCell>{data.fieldServiceTaskNumber}</StyledTableCell>
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

export default RequestDetailShow;
