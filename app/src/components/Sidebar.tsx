import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
  { text: "Inventario", icon: <InventoryIcon />, path: "/inventario" },
  { text: "Facturas", icon: <ReceiptIcon />, path: "/facturas" },
  { text: "Configuración", icon: <SettingsIcon />, path: "/configuracion" },
];

export default function Sidebar() {
  const location = useLocation();

  // TODO: Integrar con branding y permisos por rol
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: 0,
          pt: 1,
        },
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Menú principal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 0 }}>
        {menu.map(item => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}