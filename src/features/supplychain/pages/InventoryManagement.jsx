import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Table,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { listInventory, softDeleteInventory } from "../../../services/api/InventoryServices";
import { Link, useNavigate } from "react-router-dom";

const columns = [
  { label: "ID", dataKey: "id", sx: { minWidth: 60, whiteSpace: "nowrap" } },
  { label: "Name", dataKey: "name" },
  { label: "MIT Number", dataKey: "mitNumber" },
  { label: "Part Number", dataKey: "inBoxPartNumber" },
  { label: "Vendor", dataKey: "vendorName" },
  { label: "Location", dataKey: "inventoryLocation" },
  { label: "Status", dataKey: "status" },
  { label: "Description", dataKey: "description" },
  { label: "Action", dataKey: "action" },
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryResponse = await listInventory();
        setInventory(inventoryResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const softDeleteItem = async (id) => {
    try {
      await softDeleteInventory(id);
      setInventory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item.");
    }
  };

  const paginatedData = inventory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return (
      <Box p={2} mt={10}>
        <Typography variant="h6">Loading inventory data...</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} sx={{ minHeight: "100vh" }}>
      <Button variant="contained" disableElevation component={Link} to="/supply-chain-home">
        Home
      </Button>

      <Box bgcolor="lightgray" p={2} mt={1} borderRadius={1}>
        <Button
          variant="contained"
          disableElevation
          sx={{ backgroundColor: "success.main", "&:hover": { backgroundColor: "darkgreen" } }}
          component={Link}
          to="/AddNewInventory"
        >
          Create New Part
        </Button>

        <Typography variant="h6" fontWeight="bold" color="black" mt={4}>
          Inventory List
        </Typography>

        {error && (
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        )}

        <Paper sx={{ width: "100%", mt: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.dataKey}
                      align="left"
                      sx={{
                        backgroundColor: "DarkGray",
                        fontWeight: "bold",
                        whiteSpace: column.sx?.whiteSpace || "normal",
                        minWidth: column.sx?.minWidth || "auto",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.dataKey}
                        align="left"
                        sx={{
                          bgcolor: row.deletedAt ? "lightgray" : "white",
                          opacity: row.deletedAt ? 0.6 : 1,
                          whiteSpace: column.sx?.whiteSpace || "normal",
                          minWidth: column.sx?.minWidth || "auto",
                        }}
                      >
                        {column.dataKey === "status" ? (
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 2,
                              py: 1,
                              borderRadius: 1,
                              bgcolor: row.status.toLowerCase() === "available" ? "green" : "red",
                              color: "white",
                              fontWeight: "bold",
                              textAlign: "center",
                              minWidth: 80,
                            }}
                          >
                            {row.status}
                          </Box>
                        ) : column.dataKey === "action" ? (
                          row.deletedAt ? (
                            <Typography color="error">Deleted</Typography>
                          ) : (
                            <Box display="flex" gap={1}>
                              <IconButton onClick={() => navigate(`/edit/${row.id}`)}>
                                <EditIcon color="primary" />
                              </IconButton>
                              <IconButton onClick={() => navigate(`/showInventory/${row.id}`)}>
                                <VisibilityIcon color="info" />
                              </IconButton>
                              <IconButton onClick={() => softDeleteItem(row.id)}>
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Box>
                          )
                        ) : row[column.dataKey] ? (
                          String(row[column.dataKey])
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Pagination
              count={Math.ceil(inventory.length / itemsPerPage)}
              page={page}
              onChange={(_event, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default InventoryManagement;
