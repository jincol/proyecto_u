import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar: menú lateral */}
      <Sidebar />

      {/* Área derecha: header fijo + contenido dinámico */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header: título, usuario, notificaciones, export, theme */}
        <Header>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            <NotificationBell />
          </Box>
        </Header>
        {/* Contenido principal de la página */}
        <Box
          component="main"
          sx={{
            flex: 1,
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
            bgcolor: "background.paper",
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}