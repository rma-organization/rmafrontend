import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { listRequests } from "../../../services/api/InventoryServices";
import { Link } from "react-router-dom";

const ListRequestsComponent = () => {
  const [requests, setRequests] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [tempStatus, setTempStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await listRequests();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching requests.");
        setLoading(false);
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleEdit = (row) => {
    setEditRowId(row.id);
    // Set the temporary status when you click Edit
    setTempStatus((prev) => ({ ...prev, [row.id]: row.status || "Requested" }));
  };

  const handleSave = async (rowId) => {
    const updatedStatus = tempStatus[rowId];

    if (!updatedStatus) {
      setError("Status is required to update.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/requests/${rowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request.");
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === rowId ? { ...req, status: updatedStatus } : req))
      );
      setEditRowId(null);
      setSuccessMessage("Request updated successfully!");
    } catch (error) {
      setError("Error updating request.");
      console.error("Error updating request:", error);
    }
  };

  const handleDelete = async (rowId) => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/requests/${rowId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete request.");
      }

      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== rowId));
      setSuccessMessage("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleCloseSnackbar = () => setSuccessMessage(null);
  const handlePageChange = (event, newPage) => setPage(newPage);

  const statusStyles = {
    Approved: { backgroundColor: "#28a745", color: "#fff" },
    Requested: { backgroundColor: "#6c757d", color: "#fff" },
    Declined: { backgroundColor: "#dc3545", color: "#fff" },
    "En Route": { backgroundColor: "#007bff", color: "#fff" },
    "At Office": { backgroundColor: "#6f42c1", color: "#fff" },
    "Faulty Returned": { backgroundColor: "#ff9800", color: "#fff" },
    Collected: { backgroundColor: "#17a2b8", color: "#fff" },
    Rejected: { backgroundColor: "#dc3545", color: "#fff" },
    Completed: { backgroundColor: "#c46210", color: "#fff" },
  };

  // Define valid transitions for each status
  const validTransitions = {
    "At Office": ["Collected", "Faulty Returned"],
    Requested: [],
    Collected: [],
    "Faulty Returned": [],
    Approved: [],
    Declined: [],
    Rejected: [],
  };

  return (
    <>
      {/* <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      /> */}
      <Box p={2} mt={10}>
        <Button variant="contained" component={Link} to="/" sx={{ mb: 3 }}>
          Home
        </Button>

        <Box bgcolor="lightgray" p={2} mt={3} borderRadius={1}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "success.main",
              "&:hover": { backgroundColor: "darkgreen" },
              mb: 2,
            }}
            component={Link}
            to="/RequestPage"
          >
            Request New Part
          </Button>

          <Typography variant="h6" fontWeight="bold" color="black" mt={4}>
            Requests List
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="body1" color="error" mt={2}>
              {error}
            </Typography>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Part ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.partId}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{formatDate(row.createdAt)}</TableCell>
                          <TableCell>{formatDate(row.updatedAt)}</TableCell>
                          <TableCell>
                            {editRowId === row.id ? (
                              <Select
                                value={tempStatus[row.id] || ""}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setTempStatus((prev) => ({
                                    ...prev,
                                    [row.id]: newStatus,
                                  }));
                                }}
                                fullWidth
                                size="small"
                              >
                                {/* Dynamically set the allowed status based on current status */}
                                {validTransitions[row.status]?.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <Box
                                sx={{
                                  ...statusStyles[row.status] || {},
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                }}
                              >
                                {row.status}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            {editRowId === row.id ? (
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleSave(row.id)}
                              >
                                Save
                              </Button>
                            ) : (
                              <Box display="flex" gap={1}>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => handleEdit(row)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  Delete
                                </Button>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <Pagination
                  count={Math.ceil(requests.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  shape="rounded"
                  color="primary"
                />
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListRequestsComponent;
