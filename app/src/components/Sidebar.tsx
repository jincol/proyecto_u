import { List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
  { text: "Inventario", icon: <InventoryIcon />, path: "/inventario" },
  { text: "Facturas", icon: <ReceiptIcon />, path: "/facturas" },
  { text: "Configuración", icon: <SettingsIcon />, path: "/configuracion" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" sx={{ width: 220, "& .MuiDrawer-paper": { width: 220 } }}>
      <List>
        {menu.map(item => (
          <ListItem
            key={item.text}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              ...(location.pathname === item.path && {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }),
            }}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}