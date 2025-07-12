import { IconButton, Badge, Menu, MenuItem, Typography, ListItemIcon } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

const notifications = [
  { type: "warning", msg: "Producto A cerca de agotar stock." },
  { type: "info", msg: "Nueva factura para cliente Jin." },
  { type: "error", msg: "Anomalía: factura #1234 supera promedio." },
  { type: "success", msg: "¡Junio será récord de ventas!" },
];

const icons = {
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  error: <ErrorIcon color="error" />,
  success: <CheckCircleIcon color="success" />,
};

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton color="primary" onClick={e => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography color="text.secondary">Sin notificaciones</Typography>
          </MenuItem>
        ) : (
          notifications.map((n, idx) => (
            <MenuItem key={idx}>
              <ListItemIcon>{icons[n.type]}</ListItemIcon>
              <Typography variant="body2">{n.msg}</Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}