import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper, Collapse, ListSubheader } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: 'Part Request',
    icon: <AccountTreeIcon />, 
    subItems: [
      { name: 'RMA Part Request Management', path: '/PartRequestManagementRMA' },
      { name: 'Part Request Management', path: '/StatusPage' },
      { name: 'Request', path: '/RequestPage' }
    ]
  },
  {
    title: 'Supply Chain',
    icon: <InventoryIcon />, 
    subItems: [
      { name: 'Part Request Management', path: '/ListInventoryComponent' },
      { name: 'Add New Part', path: '/AddNewInventory' },
      { name: 'Inventory Management', path: '/InventoryManagement' }
    ]
  },
  {
    title: 'Identity',
    icon: <PeopleIcon />, 
    subItems: [
      { name: 'Manage User', path: '/ManageUser' },
      { name: 'Add User', path: '/AddUser' },
      { name: 'Add Vendor', path: '/AddVendor' },
      { name: 'Add Customer', path: '/AddCustomer' }
      
    ]
  }
];

const StyledList = styled(List)(() => ({
  '& .MuiListItemIcon-root': { color: 'white' },
}));

const theme = createTheme({
  palette: { mode: 'dark' },
});

export default function Sidebar() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = React.useState({});

  // Toggle function for expanding/collapsing sections
  const handleToggle = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Paper sx={{ width: '320px', height: '100vh', bgcolor: 'black', color: 'white', overflowY: 'auto', borderRadius: '20px 0 0 20px' }}>
          <StyledList>
            {/* Blank Button */}
            <ListItemButton sx={{ padding: '30px 20px' }} />
            <Divider sx={{ bgcolor: 'gray' }} />

            {/* Home Button */}
            <ListItemButton sx={{ padding: '40px 20px' }} onClick={() => navigate('/')}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HomeIcon sx={{ fontSize: 36 }} /> 
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontSize: 30, fontWeight: 'bold' }} />
            </ListItemButton>
            <Divider sx={{ bgcolor: 'gray' }} />

            {/* Render Menu Sections */}
            {menuItems.map((menu) => (
              <Box key={menu.title}>
                <ListSubheader sx={{ bgcolor: 'black', color: 'gray', fontSize: 14 }}>
                  {menu.title.toUpperCase()}
                </ListSubheader>
                <ListItemButton onClick={() => handleToggle(menu.title)}>
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.title} primaryTypographyProps={{ fontSize: 16, fontWeight: 'bold' }} />
                  {openSections[menu.title] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSections[menu.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ bgcolor: 'rgba(255, 255, 255, 0.45)', borderRadius: '10px', margin: '5px 10px', padding: '10px' }}>
                    {menu.subItems.map((subItem) => (
                      <ListItem key={subItem.name} disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(subItem.path)}>
                          <ListItemText primary={subItem.name} primaryTypographyProps={{ fontSize: 14 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider sx={{ bgcolor: 'gray' }} />
              </Box>
            ))}
          </StyledList>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}