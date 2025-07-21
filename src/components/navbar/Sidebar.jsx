import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Collapse,
  ListSubheader,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  {
    title: 'Part Request',
    icon: <AccountTreeIcon />,
    subItems: [
      { name: 'RMA Part Request Management', path: '/PartRequestManagementRMA' },
      { name: 'Part Request Management', path: '/StatusPage' },
      { name: 'Request', path: '/RequestPage' },
    ],
  },
  {
    title: 'Supply Chain',
    icon: <InventoryIcon />,
    subItems: [
      { name: 'Part Request Management', path: '/ListInventoryComponent' },
      { name: 'Add New Part', path: '/AddNewInventory' },
      { name: 'Inventory Management', path: '/InventoryManagement' },
    ],
  },
  {
    title: 'Identity',
    icon: <PeopleIcon />,
    subItems: [
      { name: 'Manage User', path: '/ManageUser' },
      { name: 'Add User', path: '/AddUser' },
      { name: 'Add Vendor', path: '/AddVendor' },
      { name: 'Add Customer', path: '/AddCustomer' },
    ],
  },
];

const roleAccess = {
  RMA: ['/rma-home', '/PartRequestManagementRMA'],
  ADMIN: ['/admin-home', '/AddUser', '/ManageUser', '/AddVendor', '/AddCustomer'],
  SUPPLYCHAIN: [
    '/add-inventory', '/ListInventoryComponent', '/InventoryManagement',
    '/EditInventory', '/SuccessfullyAddInventory', '/RequestDetailShow', '/showInventory/:id', '/AddNewInventory'
  ],
  ENGINEER: ['/engineer-home', '/RequestPage', '/StatusPage'],
};

const StyledList = styled(List)(() => ({
  '& .MuiListItemIcon-root': { color: 'white' },
}));

const theme = createTheme({
  palette: { mode: 'dark' },
});

export default function Sidebar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);
  }, []);

  const isAuthorized = (path) => {
    if (userRole === 'ADMIN') return true;
    return roleAccess[userRole]?.includes(path);
  };

  const SidebarContent = (
    <StyledList>
      <ListItemButton sx={{ px: 2, py: 1 }} />
      <Divider sx={{ bgcolor: 'gray' }} />

      <ListItemButton sx={{ px: 2, py: 2 }} onClick={() => {
        if (isMobile) setOpenDrawer(false);
        navigate('/');
      }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <HomeIcon sx={{ fontSize: 28 }} />
        </ListItemIcon>
        <ListItemText primary="Home" primaryTypographyProps={{ fontSize: 20, fontWeight: 'bold' }} />
      </ListItemButton>
      <Divider sx={{ bgcolor: 'gray' }} />

      {menuItems.map((menu) => (
        <Box key={menu.title}>
          <ListSubheader sx={{ bgcolor: 'black', color: 'gray', fontSize: 13 }}>
            {menu.title.toUpperCase()}
          </ListSubheader>
          <ListItemButton onClick={() =>
            setOpenSections((prev) => ({ ...prev, [menu.title]: !prev[menu.title] }))
          }>
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.title} primaryTypographyProps={{ fontSize: 15, fontWeight: 'bold' }} />
            {openSections[menu.title] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSections[menu.title]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              mx: 1,
              mb: 1,
              px: 1,
              py: 0.5,
            }}>
              {menu.subItems.map((subItem) => (
                <ListItem key={subItem.name} disablePadding>
                  <ListItemButton
                    sx={{
                      pl: 4,
                      opacity: isAuthorized(subItem.path) ? 1 : 0.5,
                      pointerEvents: isAuthorized(subItem.path) ? 'auto' : 'none',
                    }}
                    onClick={() => {
                      if (isAuthorized(subItem.path)) {
                        if (isMobile) setOpenDrawer(false);
                        navigate(subItem.path);
                      }
                    }}
                  >
                    <ListItemText primary={subItem.name} primaryTypographyProps={{ fontSize: 13 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Divider sx={{ bgcolor: 'gray' }} />
        </Box>
      ))}
    </StyledList>
  );

  return (
    <ThemeProvider theme={theme}>
      {isMobile ? (
        <>
          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            sx={{
              '& .MuiDrawer-paper': {
                bgcolor: 'black',
                width: 280,
                color: 'white'
              }
            }}
          >
            {SidebarContent}
          </Drawer>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpenDrawer(true)}
            sx={{ position: 'fixed', top: 10, left: 10, zIndex: 1300 }}
          >
            <MenuIcon />
          </IconButton>
        </>
      ) : (
        <Box
          sx={{
            width: '320px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bgcolor: 'black',
            color: 'white',
            overflowY: 'auto',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            zIndex: theme.zIndex.drawer,
          }}
        >
          {SidebarContent}
        </Box>
      )}
    </ThemeProvider>
  );
}
