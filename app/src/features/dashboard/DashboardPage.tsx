import { Box, Paper, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const kpiData = [
  { label: "Clientes Activos", value: 132 },
  { label: "Facturas Pendientes", value: 18 },
  { label: "Stock Bajo", value: 5 },
];
const chartData = [
  { name: "Cobrado", value: 7000 },
  { name: "Pendiente", value: 3000 },
];
const COLORS = ["#0088FE", "#FFBB28"];
const SIDEBAR_WIDTH = 220;

export default function DashboardPage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Header onLogout={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} />
        <Box sx={{ p: 4, ml: 2 }}>
          <Typography variant="h4" mb={2}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {kpiData.map((kpi) => (
              <Box key={kpi.label} sx={{ flex: '1 1 300px', minWidth: 250 }}>
                <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{kpi.label}</Typography>
                  <Typography variant="h5" color="primary">{kpi.value}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 400px' }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" mb={2}>Cobros</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}