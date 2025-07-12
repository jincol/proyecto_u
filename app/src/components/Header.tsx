import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import ExportButton from "./ExportButton";
import { ReactNode, useState } from "react";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // TODO: Integrar con sistema de usuarios/roles
  const user = { name: "Juan Pérez", avatar: "/avatar.png", role: "Admin" };

  return (
    <AppBar position="sticky" elevation={2} color="default" sx={{ zIndex: 1101 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Facturación y Administración
        </Typography>
        <ThemeToggle />
        <ExportButton />
        {children}
        <Tooltip title="Perfil y opciones">
          <IconButton sx={{ ml: 2 }} onClick={e => setAnchorEl(e.currentTarget)}>
            <Avatar src={user.avatar} alt={user.name} />
          </IconButton>
        </Tooltip>
        <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem>{user.name} ({user.role})</MenuItem>
          <MenuItem onClick={() => {/* TODO: Acción de logout */}}>Cerrar sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}