import React, { useState } from "react";
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
  Pagination,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Link, useNavigate } from "react-router-dom";

// Columns configuration
const columns = [
  { width: 25, label: "ID", dataKey: "id" },
  { width: 150, label: "Name", dataKey: "name" },
  { width: 120, label: "Email", dataKey: "email" },
  { width: 100, label: "Role", dataKey: "role" },
  { width: 200, label: "Action", dataKey: "action" },
];

const ManageUser = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Sample static data for front-end only
  
  const manageUser = [
  { id: 1, name: "", email: "", role: ["Supply-Chain"] },
  { id: 2, name: "", email: "", role: ["User", "Engineer"] },
  { id: 3, name: "", email: "", role: ["Super Admin", "Engineer"] },
  { id: 4, name: "", email: "", role: ["Engineer"] },
  { id: 5, name: "", email: "", role: ["User"] },
];

  // Pagination handler
  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  // Paginate data
  const paginatedData = manageUser.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handle actions
  const handleEdit = (row) => navigate(`/edit/${row.id}`);
  const handleShow = (row) => navigate(`/show/${row.id}`);
  const handleDelete = (row) => console.log("Delete", row);

  // Custom Table Components for react-virtuoso
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }} />,
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };

  // Fixed Table Header
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

  // Row Content Function
  const rowContent = (_index, row) => (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align="left">
          {column.dataKey === "action" ? (
            <Box display="flex" gap={1}>
              <Button
                variant="text"
                sx={{ color: "white", bgcolor: "primary.main" }}
                component={Link}
                to={`/edit/${row.id}`}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "yellow", color: "black" }}
                component={Link}
                to={`/show/${row.id}`}
              >
                Show
              </Button>

              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "error.main", bgcolor: "error.main" }}
                onClick={() => handleDelete(row)}
              >
                Delete
              </Button>
            </Box>
          ) : row[column.dataKey] !== undefined && row[column.dataKey] !== null ? (
            String(row[column.dataKey])
          ) : (
            "N/A"
          )}
        </TableCell>
      ))}
    </>
  );

  return (
    <Box p={2} mt={1}>
      <Button variant="contained" disableElevation component={Link} to="/">
        Home
      </Button>

      <Box bgcolor="lightgray" p={1} mt={5} borderRadius={1}>
        <Button
          variant="contained"
          disableElevation
          sx={{ backgroundColor: "success.main", "&:hover": { backgroundColor: "darkgreen" } }}
          component={Link}
          to="/add-user"
        >
          Add New User
        </Button>

        <Typography variant="h6" fontWeight="bold" color="black" mt={4}>
          Manage User
        </Typography>

        <Paper style={{ height: 300, width: "100%", marginTop: 10 }}>
          <TableVirtuoso
            data={paginatedData}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />

          <Box display="flex" justifyContent="flex-end" mt={2} p={2}>
            <Pagination
              count={Math.ceil(manageUser.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ManageUser;
