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
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

import { listRequests, updateRequest } from "../../../services/api/RequestServices";
import { sendNotification } from "../../../services/api/NotificationServices";
import { Link, useNavigate } from "react-router-dom";

const ListRequestsComponent = () => {
  const [requests, setRequests] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [tempStatus, setTempStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await listRequests();
        setRequests(data);
      } catch (error) {
        setError("Error fetching requests.");
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleEdit = (row) => {
    const editableStatuses = ["Requested", "Approved", "En Route", "At Office"];
    if (editableStatuses.includes(row.status)) {
      setEditRowId(row.id);
      setTempStatus((prev) => ({ ...prev, [row.id]: row.status || "Requested" }));
    }
  };

  const handleSave = async (rowId) => {
    try {
      const updatedStatus = tempStatus[rowId];
      await updateRequest(rowId, { status: updatedStatus });

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === rowId ? { ...req, status: updatedStatus } : req
        )
      );
      setEditRowId(null);
      setSuccessMessage("Request updated successfully!");

      const username = localStorage.getItem("username") || "system";
      const message = `Request ID ${rowId} status updated to ${updatedStatus}`;

      await sendNotification({
        receiverRole: "engineer",
        message,
        type: "STATUS_UPDATE",
        status: updatedStatus,
        senderUsername: username,
        requestsId: rowId,
      });
    } catch (error) {
      console.error("Error updating request or sending notification:", error);
      setError("Failed to update request or send notification.");
    }
  };

  const handleShow = (rowId) => {
    navigate(`/show/${rowId}`);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const handleCloseSnackbar = () => setSuccessMessage(null);
  const handlePageChange = (_, newPage) => setPage(newPage);

  const paginatedRequests = requests.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(requests.length / rowsPerPage);

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

  return (
    <>
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />

      <Box p={2} mt={1}>
        <Button variant="contained" component={Link} to="/supply-chain-home">
          Home
        </Button>

        <Box bgcolor="lightgray" p={2} mt={1} borderRadius={1}>
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
            <>
              <Paper style={{ width: "100%", marginTop: 20 }}>
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
                      {paginatedRequests.map((row) => (
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
                                onChange={(e) =>
                                  setTempStatus({ ...tempStatus, [row.id]: e.target.value })
                                }
                                fullWidth
                                size="small"
                              >
                                <MenuItem value="Requested">Requested</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                                <MenuItem value="En Route">En Route</MenuItem>
                                <MenuItem value="At Office">At Office</MenuItem>
                              </Select>
                            ) : (
                              <Box
                                sx={{
                                  backgroundColor:
                                    statusStyles[row.status]?.backgroundColor || "#ccc",
                                  color: statusStyles[row.status]?.color || "#000",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                }}
                              >
                                {row.status}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            {editRowId === row.id ? (
                              <IconButton
                                color="success"
                                aria-label="save"
                                onClick={() => handleSave(row.id)}
                              >
                                <SaveIcon />
                              </IconButton>
                            ) : (
                              <Box display="flex" gap={1}>
                                {["Requested", "Approved", "En Route", "At Office"].includes(
                                  row.status
                                ) && (
                                  <IconButton
                                    color="warning"
                                    aria-label="edit"
                                    onClick={() => handleEdit(row)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                )}
                                <IconButton
                                  color="info"
                                  aria-label="show"
                                  onClick={() => handleShow(row.id)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  shape="rounded"
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListRequestsComponent;
