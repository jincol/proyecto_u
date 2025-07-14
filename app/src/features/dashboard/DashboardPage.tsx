import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaidIcon from "@mui/icons-material/Paid";
import axios from "axios";
// Puedes usar recharts, chart.js, etc. Aquí simulo una gráfica simple:
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// COLORES NOTIFICACIONES
const tipoColor = {
  warning: "#FF9800",
  info: "#2196F3",
  error: "#F44336",
  success: "#43A047",
  email: "#2196F3",
  whatsapp: "#FF9800",
  push: "#F44336",
};
const tipoIcono = {
  warning: <WarningAmberIcon sx={{ mr: 1 }} />,
  info: <InfoOutlinedIcon sx={{ mr: 1 }} />,
  error: <ErrorOutlineIcon sx={{ mr: 1 }} />,
  success: <CheckCircleOutlineIcon sx={{ mr: 1 }} />,
  email: <InfoOutlinedIcon sx={{ mr: 1 }} />,
  whatsapp: <WarningAmberIcon sx={{ mr: 1 }} />,
  push: <ErrorOutlineIcon sx={{ mr: 1 }} />,
};

function getKPI(notificaciones, type, filterMsg) {
  if (!notificaciones) return 0;
  return notificaciones.filter(
    (n) =>
      (type ? n.type === type : true) &&
      (filterMsg ? n.message.toLowerCase().includes(filterMsg) : true)
  ).length;
}

export default function DashboardPage() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulados: deberías traer estos datos de tu backend
  const [clientes, setClientes] = useState(32);
  const [facturas, setFacturas] = useState(124);
  const [alertasStock, setAlertasStock] = useState<number>(0);
  const [ventasMensuales, setVentasMensuales] = useState([
    4000, 6500, 8000, 9100, 12000, 11300, 14000,
  ]);
  const [labelsMes, setLabelsMes] = useState([
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul",
  ]);

  useEffect(() => {
    fetchNotificaciones();
    fetchClientes();
    fetchFacturas();
    // fetchPagosPendientes();
    fetchAlertasStock();
  }, []);

  const fetchClientes = async () => {
    const resp = await axios.get("http://localhost:8000/clients");
    setClientes(Array.isArray(resp.data) ? resp.data.length : 0);
  };

  const fetchFacturas = async () => {
    const resp = await axios.get("http://localhost:8000/invoices");
    setFacturas(Array.isArray(resp.data) ? resp.data.length : 0);
  };

  // const fetchPagosPendientes = async () => {
  //   const resp = await axios.get("http://localhost:8000/invoices/pending");
  //   console.log("Pagos pendientes (response):", resp.data);
  //   setPagosPendientes(Array.isArray(resp.data) ? resp.data.length : 0);
  // };

  const fetchAlertasStock = async () => {
      const resp = await axios.get("http://localhost:8000/products/low-stock?threshold=5");
      console.log("Alertas de stock (response):", resp.data);
      setAlertasStock(Array.isArray(resp.data) ? resp.data.length : 0);
  };
  
  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const resp = await axios.get("http://localhost:8000/notifications");
      setNotificaciones(Array.isArray(resp.data) ? resp.data : []);
    } catch {
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const notiGrouping = (type) =>
    notificaciones
      .filter((n) => n.type === type)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 4);

  // KPI Cards
  const kpiCards = [
    {
      label: "Clientes",
      value: clientes,
      icon: <PeopleIcon />,
      color: "#1976d2",
    },
    {
      label: "Facturas",
      value: facturas,
      icon: <MonetizationOnIcon />,
      color: "#43A047",
    },
    {
      label: "Notificaciones",
      value: notificaciones.length,
      icon: <ErrorOutlineIcon />,
      color: "#F44336",
    },
    {
      label: "Pagos pendientes",
      value: getKPI(notificaciones, "email", "pendiente"),
      icon: <PaidIcon />,
      color: "#FF9800",
    },
    {
      label: "Alertas de stock",
      value: alertasStock,
      icon: <InventoryIcon />,
      color: "#2196F3",
    },
  ];

  // Gráfica ventas
  const dataVentas = {
    labels: labelsMes,
    datasets: [
      {
        label: "Ventas ($)",
        backgroundColor: "#1976d2",
        data: ventasMensuales,
        borderRadius: 8,
      },
    ],
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        Resumen visual de tu negocio y KPIs clave
      </Typography>
      {/* KPIs */}
      <Grid container spacing={2} mb={2}>
        {kpiCards.map((kpi) => (
          <Grid item xs={12} sm={6} md={2.4} key={kpi.label}>
            <Paper
              elevation={4}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 3,
                bgcolor: kpi.color,
                color: "#fff",
                minHeight: 64,
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            >
              <Avatar sx={{ bgcolor: "#fff", color: kpi.color, mr: 2 }}>
                {kpi.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} lineHeight={1}>
                  {kpi.value}
                </Typography>
                <Typography variant="body2">{kpi.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} mb={2}>
        {/* Ventas mensuales */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 300 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Evolución de ventas ($)
            </Typography>
            <Bar data={dataVentas} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "#eee" } },
              },
            }} />
          </Paper>
        </Grid>
        {/* Productos más vendidos / Cuentas por cobrar */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minHeight: 300 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Cuentas por cobrar & Productos destacados
            </Typography>
            {/* Simulación: puedes cambiar por una tabla o gráfica real */}
            <Stack spacing={1}>
              <Box display="flex" alignItems="center">
                <PaidIcon color="warning" sx={{ mr: 1 }} />
                <Typography>
                  $2,800 por cobrar (5 facturas vencidas)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <InventoryIcon color="info" sx={{ mr: 1 }} />
                <Typography>
                  Diesel, Aceite, Filtros: <b>Stock bajo</b>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <MonetizationOnIcon color="success" sx={{ mr: 1 }} />
                <Typography>
                  Producto más vendido: <b>Factura F0007</b>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      {/* NOTIFICACIONES AGRUPADAS */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mt: 2,
          maxHeight: 350,
          overflowY: "auto",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Notificaciones recientes
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {["warning", "error", "success", "info", "email", "whatsapp", "push"].map((type) =>
              notiGrouping(type).map((n) => (
                <Grid item xs={12} sm={6} md={4} key={n.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: tipoColor[n.type] || "#eee",
                      color: "#fff",
                      py: 1.5,
                      px: 2,
                      mb: 1,
                      borderRadius: 2,
                      fontSize: 16,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    {tipoIcono[n.type] || null}
                    <span>{n.message}</span>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>
      <Divider sx={{ my: 4 }} />
      {/* Puedes seguir agregando secciones: ML, alertas, recomendaciones, etc */}
    </Box>
  );
}