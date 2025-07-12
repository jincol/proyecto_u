import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Autocomplete, Snackbar, Alert, CircularProgress
} from "@mui/material";
import FacturasTable from "./FacturasTable";
import FacturaModal from "./FacturasModal";
import type { Invoice } from "../../types/invoice";
import {
  getFacturas,
  createFactura,
  updateFactura,
  deleteFactura,
} from "../../api/facturas";

// Si tienes endpoints para clientes/productos, ¡úsalos! Si no, deja los demo por ahora:
const clientesDemo = [
  { id: 1, name: "Cliente A" },
  { id: 2, name: "Cliente B" },
];
const productosDemo = [
  { product_id: 1, name: "Producto X" },
  { product_id: 2, name: "Producto Y" },
];

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [facturaEdit, setFacturaEdit] = useState<Invoice | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);
  const [filtroCliente, setFiltroCliente] = useState<{ id: number, name: string } | null>(null);
  const [filtroFolio, setFiltroFolio] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    setLoading(true);
    try {
      const data = await getFacturas();
      setFacturas(data);
    } catch (err) {
      setSnackbar({ open: true, msg: "Error cargando facturas" });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar facturas por cliente y folio
  const facturasFiltradas = facturas.filter(f =>
    (!filtroCliente || f.client_id === filtroCliente.id) &&
    (f.folio?.toLowerCase().includes(filtroFolio.toLowerCase()))
  );

  const handleNuevaFactura = () => {
    setFacturaEdit(undefined);
    setModalOpen(true);
  };

  const handleEditarFactura = (factura: Invoice) => {
    setFacturaEdit(factura);
    setModalOpen(true);
  };

  const handleEliminarFactura = async (factura: Invoice) => {
    if (window.confirm(`¿Eliminar factura ${factura.folio}?`)) {
      try {
        await deleteFactura(factura.id);
        setSnackbar({ open: true, msg: "Factura eliminada" });
        fetchFacturas();
      } catch (err) {
        setSnackbar({ open: true, msg: "Error eliminando factura" });
      }
    }
  };

  const handleGuardarFactura = async (data: Omit<Invoice, "id" | "folio" | "client_name">) => {
    try {
      if (facturaEdit) {
        await updateFactura(facturaEdit.id, data);
        setSnackbar({ open: true, msg: "Factura editada" });
      } else {
        await createFactura(data);
        setSnackbar({ open: true, msg: "Factura agregada" });
      }
      setModalOpen(false);
      fetchFacturas();
    } catch (err) {
      setSnackbar({ open: true, msg: "Error guardando factura" });
    }
  };

  const handleRecargar = () => {
    fetchFacturas();
    setSnackbar({ open: true, msg: "Facturas recargadas" });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2} fontWeight={600}>Gestión de Facturas</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={handleNuevaFactura}>
          Nueva factura
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleRecargar}>
          Recargar
        </Button>
        <Autocomplete
          options={clientesDemo}
          getOptionLabel={o => o.name}
          value={filtroCliente}
          onChange={(_, v) => setFiltroCliente(v)}
          sx={{ width: 180 }}
          renderInput={params => <TextField {...params} label="Filtrar cliente" />}
        />
        <TextField
          label="Buscar folio"
          value={filtroFolio}
          onChange={e => setFiltroFolio(e.target.value)}
          sx={{ width: 160 }}
        />
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : (
        <FacturasTable
          facturas={facturasFiltradas}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10) || 5); setPage(0); }}
          onEdit={handleEditarFactura}
          onDelete={handleEliminarFactura}
        />
      )}
      <FacturaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onGuardar={handleGuardarFactura}
        invoice={facturaEdit}
        clientes={clientesDemo}
        productos={productosDemo}
      />
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}