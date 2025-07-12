import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../features/dashboard/DashboardPage";
import ClientesPage from "../features/clientes/ClientesPage";
import InventarioPage from "../features/inventario/InventarioPage";
import FacturasPage from "../features/facturas/FacturasPage";
import ConfiguracionPage from "../features/configuracion/ConfiguracionPage";
import LoginPage from "../features/auth/LoginPage";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  const isAuth = !!localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
      <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/clientes" element={isAuth ? <ClientesPage /> : <Navigate to="/login" />} />
      <Route path="/inventario" element={isAuth ? <InventarioPage /> : <Navigate to="/login" />} />
      <Route path="/facturas" element={isAuth ? <FacturasPage /> : <Navigate to="/login" />} />
      <Route path="/configuracion" element={isAuth ? <ConfiguracionPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}