import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

const EditRequest = () => {
  const [vendor, setVendor] = useState("");

  const handleVendorChange = (event) => {
    setVendor(event.target.value);
  };

  return (
    <Box p={1} mt={10}>
     
      {/* Part List Section */}
      <Box bgcolor="lightgray" p={1} mt={2} borderRadius={1}>
        {/* Part List Title */}
        <Typography variant="h6" fontWeight="bold" color="black" mt={2}>
          Edit Part
        </Typography>

        {/* Back Button */}
        
      <Button variant="contained" disableElevation component={Link} to="/ListInventoryComponent">
        Back
      </Button>

        {/* Form Section */}
        <Paper sx={{ padding: 3, mt: 2 }}>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={6}>
              {[
                "Box Part Number",
                "In Box Part Number",
                "Box Serial Number",
                "In Box Serial Number",
                "QTY",
                "Inventory Location",
                "MIT Reference Number",
                "Item Type",
                "Inventory Type",
              ].map((label, index) => (
                <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">{label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField fullWidth variant="outlined" />
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid item xs={6}>
              {[
                "PO Number",
                "Customer Name",
                "Box Serial Number",
                "In Box Serial Number",
                "Status",
                "Description",
                
              ].map((label, index) => (
                <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">{label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline={label === "Comments" || label === "Description"}
                      rows={label === "Comments" || label === "Description" ? 3 : 1}
                    />
                  </Grid>
                </Grid>
              ))}

              {/* Vendor Dropdown */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Vendor</Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl fullWidth variant="outlined">
                    <Select value={vendor} onChange={handleVendorChange} >
                      <MenuItem value={10}>Vendor 1</MenuItem>
                      <MenuItem value={20}>Vendor 2</MenuItem>
                      <MenuItem value={30}>Vendor 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Add Part Button */}
          <Box mt={3}>
            <Button fullWidth variant="contained"  sx={{ backgroundColor: "blue", color: "white" }} disableElevation component={Link} to="/SuccessfullyAddInventory">
              Edit Part
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditRequest;
