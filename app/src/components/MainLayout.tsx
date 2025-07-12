import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const handleLogout = () => {
    alert("Cerrar sesión");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#1976d2" }}>
      <Header onLogout={handleLogout} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: "220px", // Sidebar width
          mt: "64px",  // Header height
          minHeight: "calc(100vh - 64px)",
          background: "#1976d2", // Usa tu color
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}