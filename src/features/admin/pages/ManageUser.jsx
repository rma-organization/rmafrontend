// export default ManageUser;
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
import { fetchAllUsers } from "../../../services/api/authService";

const columns = [
  { width: 25, label: "ID", dataKey: "id" },
  { width: 150, label: "Name", dataKey: "username" },
  { width: 120, label: "Email", dataKey: "email" },
  { width: 100, label: "Role", dataKey: "roles" },
  { width: 150, label: "Approval Status", dataKey: "approvalStatus" },
];

const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchAllUsers();
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setUsers([]);
      }
    };
    loadUsers();
  }, []);

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }} />
    ),
    TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
    TableRow,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((col) => (
        <TableCell
          key={col.dataKey}
          variant="head"
          align="left"
          style={{ width: col.width }}
          sx={{ backgroundColor: "DarkGray", fontWeight: "bold" }}
        >
          {col.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (_index, row) => (
    <>
      {columns.map((col) => (
        <TableCell key={col.dataKey} align="left" style={{ wordBreak: "break-word" }}>
          {col.dataKey === "roles"
            ? Array.isArray(row[col.dataKey]) ? row[col.dataKey].join(", ") : row[col.dataKey]
            : row[col.dataKey] ?? "N/A"}
        </TableCell>
      ))}
    </>
  );

  return (
    <Box p={2} mt={1}>
      <Button variant="contained" disableElevation onClick={() => navigate("/admin-home")}>
        Home
      </Button>

      <Box bgcolor="lightgray" p={1} mt={5} borderRadius={1}>
        <Typography variant="h6" fontWeight="bold" color="black" mt={4}>
          Manage User
        </Typography>

        <Paper
          sx={{
            width: "100%",
            minHeight: "60vh",
            height: "100%",
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            overflowX: "auto",
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <TableVirtuoso
              data={paginatedData}
              components={VirtuosoTableComponents}
              fixedHeaderContent={fixedHeaderContent}
              itemContent={rowContent}
              style={{ height: "100%", minHeight: "50vh" }}
            />
          </Box>
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
