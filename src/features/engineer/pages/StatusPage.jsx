
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
  IconButton
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { listRequests, updateRequestStatus, deleteRequest } from "../../../services/api/RequestServices";
import { sendNotification, } from "../../../services/api/NotificationServices";
import { Link } from "react-router-dom";

const ListRequestsComponent = () => {
  const [requests, setRequests] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [tempStatus, setTempStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

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

  const validTransitions = {
    "At Office": ["Collected", "Faulty Returned"],
    Requested: [],
    Collected: ["Faulty Returned"],
    "Faulty Returned": [],
    Approved: [],
    Declined: [],
    Rejected: [],
  };

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

  const handleEdit = (row) => {
    const options = validTransitions[row.status] || [];
    setEditRowId(row.id);
    setTempStatus((prev) => ({
      ...prev,
      [row.id]: options.includes(row.status) ? row.status : options[0] || "",
    }));
  };

  const handleSave = async (rowId) => {
    const updatedStatus = tempStatus[rowId];
    if (!updatedStatus) {
      setError("Status is required to update.");
      return;
    }

    try {
      await updateRequestStatus(rowId, updatedStatus);

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === rowId ? { ...req, status: updatedStatus } : req
        )
      );
      setEditRowId(null);
      setSuccessMessage("Request updated successfully!");

      await sendNotification({
        receiverRole: "rma",
        message: `Request #${rowId} status changed to \"${updatedStatus}\".`,
        type: "REQUEST",
        status: updatedStatus,
      });
    } catch (error) {
      setError("Error updating request.");
      console.error("Error updating request:", error);
    }
  };

  const handleDelete = async (rowId) => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;

    try {
      await deleteRequest(rowId);

      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== rowId));
      setSuccessMessage("Request deleted successfully!");

      await sendNotification({
        receiverRole: "manager",
        message: `Request #${rowId} was deleted.`,
        type: "REQUEST",
        status: "Deleted",
      });
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

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Button variant="contained" component={Link} to="/engineer-home" sx={{ mb: 3, width: 'fit-content' }}>
          Home
        </Button>

        <Box bgcolor="lightgray" p={2} borderRadius={1} sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Button
            variant="contained"
            disableElevation
            sx={{ backgroundColor: "success.main", "&:hover": { backgroundColor: "darkgreen" }, mb: 2, alignSelf: 'flex-start' }}
            component={Link}
            to="/RequestPage"
          >
            Request New Part
          </Button>

          <Typography variant="h6" fontWeight="bold" color="black">
            Requests List
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="body1" color="error" mt={2}>{error}</Typography>
          ) : (
            <Paper sx={{ width: "100%", flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', mt: 2 }}>
              <TableContainer sx={{ flex: 1 }}>
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
                    {requests.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
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
                              onChange={(e) => setTempStatus((prev) => ({ ...prev, [row.id]: e.target.value }))}
                              fullWidth
                              size="small"
                            >
                              {(validTransitions[row.status] || []).map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <Box sx={{ ...statusStyles[row.status], padding: "5px 10px", borderRadius: "5px", textAlign: "center" }}>
                              {row.status}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          {editRowId === row.id ? (
                            <IconButton color="success" onClick={() => handleSave(row.id)} aria-label="save">
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <Box display="flex" gap={1}>
                              <IconButton
                                color="warning"
                                onClick={() => handleEdit(row)}
                                disabled={!validTransitions[row.status]?.length}
                                aria-label="edit"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton color="error" onClick={() => handleDelete(row.id)} aria-label="delete">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

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
    </Box>
  );
};

export default ListRequestsComponent;