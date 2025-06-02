import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

// Columns configuration
const columns = [
  { width: 25, label: "ID", dataKey: "id" },
  { width: 150, label: "Name", dataKey: "username" }, // Changed from 'name' to 'username'
  { width: 120, label: "Email", dataKey: "email" },
  { width: 100, label: "Role", dataKey: "roles" }, // 'roles' is an array, needs special handling
  { width: 150, label: "Approval Status", dataKey: "approvalStatus" },
];

const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Bearer token for authentication
  const bearerToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXd1c2VyIiwiaWF0IjoxNzQyOTg3NjQ2LCJleHAiOjE3NDMwMjM2NDZ9.8zawyzLeXZK0weg05fM7s4kJwpxN5iiA0ibBKL8dm_E";

  // Fetch users dynamically
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/auth/users", {
          headers: {
            "Authorization": bearerToken, // Add Bearer token for authentication
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Pagination handler
  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  // Paginate data
  const paginatedData = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
          {column.dataKey === "roles" ? (
            row[column.dataKey].join(", ") // Displaying roles as a comma-separated list
          ) : (
            row[column.dataKey] !== undefined && row[column.dataKey] !== null ? (
              String(row[column.dataKey])
            ) : (
              "N/A"
            )
          )}
        </TableCell>
      ))}
    </>
  );

  return (
    <Box p={2} mt={1}>
      <Button variant="contained" disableElevation onClick={() => navigate("/")}>Home</Button>

      <Box bgcolor="lightgray" p={1} mt={5} borderRadius={1}>
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
              count={Math.ceil(users.length / itemsPerPage)}
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

