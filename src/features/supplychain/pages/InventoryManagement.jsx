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
  Table
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { listInventory, softDeleteInventory } from "../../../services/api/InventoryServices";
import { Link, useNavigate } from "react-router-dom";

// Table Columns Configuration
const columns = [
  { width: 30, label: "ID", dataKey: "id" },
  { width: 120, label: "Name", dataKey: "name" },
  { width: 120, label: "MIT Number", dataKey: "mitNumber" },
  { width: 130, label: "Part Number", dataKey: "inBoxPartNumber" },
  { width: 100, label: "Vendor", dataKey: "vendorName" },
  { width: 130, label: "Inventory Location", dataKey: "inventoryLocation" },
  { width: 120, label: "Status", dataKey: "status" },
  { width: 250, label: "Description", dataKey: "description" },
  { width: 200, label: "Action", dataKey: "action" },
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch Inventory Data
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

  // Soft Delete Inventory Item
  const softDeleteItem = async (id) => {
    try {
      await softDeleteInventory(id);
      setInventory((prev) => prev.filter((item) => item.id !== id)); // Remove deleted item from UI
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item.");
    }
  };

  // Pagination Logic
  const paginatedData = inventory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Table Header
  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align="left"
          style={{ width: column.width }}
          sx={{ backgroundColor: "DarkGray", fontWeight: "bold" }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  // Table Row Content
  const rowContent = (_index, row) => (
    <>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="left"
          sx={{ bgcolor: row.deletedAt ? "lightgray" : "white", opacity: row.deletedAt ? 0.6 : 1 }}
        >
          {column.dataKey === "status" ? (
            // Colored Box for Status
            <Box
              sx={{
                display: "inline-block",
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: row.status.toLowerCase() === "available" ? "green" : "red",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
                minWidth: 100,
              }}
            >
              {row.status}
            </Box>
          ) : column.dataKey === "action" ? (
            row.deletedAt ? (
              <Typography color="error">Deleted</Typography>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  variant="text"
                  sx={{ color: "white", bgcolor: "primary.main" }}
                  onClick={() => navigate(`/edit/${row.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "warning.main", color: "black" }}
                  onClick={() => navigate(`/showInventory/${row.id}`)}
                >
                  Show
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "white", borderColor: "error.main", bgcolor: "error.main" }}
                  onClick={() => softDeleteItem(row.id)}
                >
                  Delete
                </Button>
              </Box>
            )
          ) : row[column.dataKey] ? (
            String(row[column.dataKey])
          ) : (
            "N/A"
          )}
        </TableCell>
      ))}
    </>
  );

  if (loading) {
    return (
      <Box p={2} mt={10}>
        <Typography variant="h6" color="black">
          Loading inventory data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2} mt={10}>
      <Button variant="contained" disableElevation component={Link} to="/SupplyChainHomePage">
        Home
      </Button>

      <Box bgcolor="lightgray" p={2} mt={10} borderRadius={1}>
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

        <Paper style={{ height: 500, width: "100%", marginTop: 20 }}>
          <TableVirtuoso
            data={paginatedData}
            components={{
              Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
              Table: (props) => <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }} />,
              TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
              TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
              TableRow,
            }}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            style={{ height: 430 }}
          />

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

