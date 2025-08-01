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

//import { getRequestById } from "../../../services/api/InventoryServices";
import { getRequestById } from "../../../services/api/RequestServices";
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
    const fetchRequest = async () => {
      try {
        const response = await getRequestById(id);
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch request"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading)
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" mt={10} textAlign="center">
        {error}
      </Typography>
    );

  if (!data)
    return (
      <Typography mt={10} textAlign="center">
        No data available
      </Typography>
    );

  return (
    <Box p={2} mt={10}>
      <Box bgcolor="lightgray" p={2} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black" mt={2}>
          Request Details
        </Typography>

        <Button
          variant="contained"
          disableElevation
          component={Link}
          to="/ListInventoryComponent"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper sx={{ padding: 3, mt: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Last Update
              </Typography>
              <Typography variant="h6">
                {data.updatedAt
                  ? new Date(data.updatedAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Status
              </Typography>
              <Typography variant="h6">{data.status || "N/A"}</Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold">
              Request Item
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 700 }}>
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
                    <StyledTableCell>{data.name}</StyledTableCell>
                    <StyledTableCell>{data.customer?.name || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.vendor?.name || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.srNumber || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.mailIds || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.description || "No description"}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={3} width={700}>
            <Typography variant="h6" fontWeight="bold">
              Fault & Task Info
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Fault Part Number</StyledTableCell>
                    <StyledTableCell>Field Service Task Number</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{data.faultPartNumber || "N/A"}</StyledTableCell>
                    <StyledTableCell>{data.fieldServiceTaskNumber || "N/A"}</StyledTableCell>
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
