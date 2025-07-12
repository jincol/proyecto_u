import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import ClientesPage from "../features/clientes/ClientesPage";
import InventarioPage from "../features/inventario/InventarioPage";
import FacturasPage from "../features/facturas/FacturasPage";
import ConfiguracionPage from "../features/configuracion/ConfiguracionPage";
import LoginPage from "../features/auth/LoginPage";
import NotFound from "../pages/NotFound";

// IMPORTA LOS COMPONENTES NUEVOS:
import PagosPage from "../features/pagos/PagosPage";
import NotificacionesPage from "../features/notificaciones/NotificacionesPage";
import RecurrenciasPage from "../features/recurrencias/RecurrenciasPage";
import SegmentosPage from "../features/segmentos/SegmentosPage";
import CategoriasPage from "../features/categorias/CategoriasPage";
import MLResultadosPage from "../features/ml/MLResultadosPage";

// Auth wrapper
function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/facturas" element={<FacturasPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        {/* Agrega las nuevas páginas */}
        <Route path="/pagos" element={<PagosPage />} />
        <Route path="/notificaciones" element={<NotificacionesPage />} />
        <Route path="/recurrencias" element={<RecurrenciasPage />} />
        <Route path="/segmentos" element={<SegmentosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/ml-resultados" element={<MLResultadosPage />} />
      </Route>
    </Routes>
  );
}