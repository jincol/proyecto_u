import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import ClientesPage from "../features/clientes/ClientesPage";
import InventarioPage from "../features/inventario/InventarioPage";
import FacturasPage from "../features/facturas/FacturasPage";
import ConfiguracionPage from "../features/configuracion/ConfiguracionPage";
import LoginPage from "../features/auth/LoginPage";
import NotFound from "../pages/NotFound";

// Puedes implementar lógica de roles aquí si lo necesitas en el futuro
function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuth = !!localStorage.getItem("token");
  // TODO: integrar roles/permisos si es necesario
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login y error siempre fuera del layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />

      {/* Todas las páginas principales dentro del layout */}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/facturas" element={<FacturasPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Route>
    </Routes>
  );
}