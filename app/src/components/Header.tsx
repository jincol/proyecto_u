import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <AppBar position="static" sx={{ zIndex: 1101 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Facturación y Administración
        </Typography>
        <ThemeToggle />
        <Box sx={{ ml: 2 }}>
          <Button color="inherit" onClick={onLogout}>Cerrar sesión</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}