import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Alert,
  useTheme,
  Stack,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const kpiColors = ["success", "info", "primary", "warning"];
const pieColors = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#9c27b0"];
const mlColors = ["#0288d1", "#43a047", "#f44336"];

export default function DashboardPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    clientes: 0,
    productos: 0,
    facturas: 0,
    cuentasPorCobrar: 0,
  });
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [mlPredVentas, setMlPredVentas] = useState([]);
  const [mlChurn, setMlChurn] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      // Datos reales o ficticios según tu backend
      const [clientesRes, productosRes, facturasRes] = await Promise.all([
        axios.get("http://localhost:8000/clients"),
        axios.get("http://localhost:8000/products"),
        axios.get("http://localhost:8000/invoices"),
      ]);
      setKpi({
        clientes: clientesRes.data.length,
        productos: productosRes.data.length,
        facturas: facturasRes.data.length,
        cuentasPorCobrar: facturasRes.data.filter(f => f.status === "pending").length,
      });
      setVentasMensuales([
        { mes: "Ene", total: 12000 },
        { mes: "Feb", total: 9800 },
        { mes: "Mar", total: 13500 },
        { mes: "Abr", total: 11000 },
        { mes: "May", total: 12500 },
        { mes: "Jun", total: 13750 },
      ]);
      setTopProductos([
        { name: "Producto A", ventas: 120 },
        { name: "Producto B", ventas: 98 },
        { name: "Producto C", ventas: 135 },
        { name: "Producto D", ventas: 110 },
        { name: "Producto E", ventas: 90 },
      ]);
      // Gráfica ML: predicción de ventas
      setMlPredVentas([
        { mes: "Ene", real: 12000, pred: 11800 },
        { mes: "Feb", real: 9800, pred: 10200 },
        { mes: "Mar", real: 13500, pred: 13200 },
        { mes: "Abr", real: 11000, pred: 11500 },
        { mes: "May", real: 12500, pred: 12600 },
        { mes: "Jun", real: 13750, pred: 14000 },
      ]);
      // ML Churn (clientes en riesgo de baja)
      setMlChurn([
        { name: "Jin", score: 0.82 },
        { name: "Ana", score: 0.73 },
        { name: "Luis", score: 0.65 },
      ]);
      // Notificaciones automáticas ficticias
      setNotificaciones([
        { type: "warning", msg: "Producto C está cerca de agotar stock." },
        { type: "info", msg: "¡Nueva factura generada para cliente Jin!" },
        { type: "error", msg: "Anomalía detectada: factura #1234 supera el promedio habitual." },
        { type: "success", msg: "Predicción de ventas: ¡junio será un mes récord!" },
      ]);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  return (
    <Box sx={{
      bgcolor: theme.palette.background.default,
      minHeight: "100vh",
      py: { xs: 2, md: 4 },
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Resumen visual de tu negocio y KPIs clave
          </Typography>
        </Box>

        {/* Notificaciones alineadas y scroll horizontal si son muchas */}
        <Box sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          overflowX: "auto",
        }}>
          {notificaciones.map((n, idx) => (
            <Alert key={idx} severity={n.type} variant="filled" sx={{ borderRadius: 2, minWidth: 320, flexGrow: 1 }}>
              {n.msg}
            </Alert>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 12 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* KPIs: una sola fila, bien alineados */}
            <Grid container spacing={5} mb={5} justifyContent="center">
              {[
                { label: "Clientes", value: kpi.clientes, chip: "Activos", color: kpiColors[0] },
                { label: "Productos", value: kpi.productos, chip: "En stock", color: kpiColors[1] },
                { label: "Facturas", value: kpi.facturas, chip: "Este mes", color: kpiColors[2] },
                { label: "Cuentas por Cobrar", value: kpi.cuentasPorCobrar, chip: "Pendientes", color: kpiColors[3] }
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <Card elevation={6} sx={{
                    borderRadius: 3,
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                    ":hover": { boxShadow: 12 },
                  }}>
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="h3" fontWeight={700} sx={{ fontSize: { xs: 36, md: 48 } }}>
                        {item.value}
                      </Typography>
                      <Chip label={item.chip} color={item.color} size="small" sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Primera fila de gráficas, 3 columnas iguales */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={4}>
                <Card elevation={6} sx={{ borderRadius: 3, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Ventas Mensuales
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={ventasMensuales}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill={pieColors[0]} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={6} sx={{ borderRadius: 3, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Productos Más Vendidos
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={topProductos}
                          dataKey="ventas"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label={({ name, ventas }) => `${name}: ${ventas}`}
                        >
                          {topProductos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={6} sx={{ borderRadius: 3, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Predicción ML: Ventas vs. Predicción
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mlPredVentas}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="real" stroke={mlColors[0]} strokeWidth={3} dot={{ r: 5 }} name="Ventas reales" />
                        <Line type="monotone" dataKey="pred" stroke={mlColors[1]} strokeDasharray="6 2" strokeWidth={3} dot={{ r: 5 }} name="Predicción ML" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Segunda fila de ML, 2 columnas iguales */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={6} sx={{ borderRadius: 3, minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      ML: Clientes en riesgo de baja
                    </Typography>
                    <Stack spacing={1}>
                      {mlChurn.map(cli => (
                        <Box key={cli.name} sx={{ display: "flex", alignItems: "center" }}>
                          <Chip
                            label={cli.name}
                            color="error"
                            variant="outlined"
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body1">
                            Score de riesgo: <b>{Math.round(cli.score * 100)}%</b>
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={6} sx={{ borderRadius: 3, minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      ML: Recomendación de productos (próximamente)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aquí podrás ver recomendaciones personalizadas para tus clientes, basadas en Machine Learning y compras históricas.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}