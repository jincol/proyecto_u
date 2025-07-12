import React, { useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Autocomplete, Snackbar, Alert
} from "@mui/material";
import FacturasTable from "./FacturasTable";
import FacturaModal from "./FacturasModal";
import type { Invoice } from "../../types/invoice";

// Datos demo
const clientesDemo = [
  { id: 1, name: "Cliente A" },
  { id: 2, name: "Cliente B" },
];
const productosDemo = [
  { product_id: 1, name: "Producto X" },
  { product_id: 2, name: "Producto Y" },
];

function randomFolio() {
  return "F-" + Math.floor(1000 + Math.random() * 9000);
}

const facturasDemo: Invoice[] = [
  {
    id: 1, folio: "F-1001", client_id: 1, client_name: "Cliente A",
    date: "2025-06-10", due_date: "2025-07-10",
    subtotal: 100, taxes: 18, total: 118,
    notes: "", payment_method: "efectivo", accounts_receivable: 0,
    status: "pending", products: [{ product_id: 1, name: "Producto X", quantity: 2, unit_price: 50 }]
  },
  {
    id: 2, folio: "F-1002", client_id: 2, client_name: "Cliente B",
    date: "2025-06-12", due_date: "2025-07-12",
    subtotal: 150, taxes: 27, total: 177,
    notes: "Entrega parcial", payment_method: "transferencia", accounts_receivable: 50,
    status: "paid", products: [{ product_id: 2, name: "Producto Y", quantity: 3, unit_price: 50 }]
  },
];

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Invoice[]>(facturasDemo);
  const [modalOpen, setModalOpen] = useState(false);
  const [facturaEdit, setFacturaEdit] = useState<Invoice | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{open: boolean, msg: string}|null>(null);
  const [filtroCliente, setFiltroCliente] = useState<{id: number, name: string}|null>(null);
  const [filtroFolio, setFiltroFolio] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filtrar facturas por cliente y folio
  const facturasFiltradas = facturas.filter(f =>
    (!filtroCliente || f.client_id === filtroCliente.id) &&
    (f.folio.toLowerCase().includes(filtroFolio.toLowerCase()))
  );

  const handleNuevaFactura = () => {
    setFacturaEdit(undefined);
    setModalOpen(true);
  };

  const handleEditarFactura = (factura: Invoice) => {
    setFacturaEdit(factura);
    setModalOpen(true);
  };

  const handleEliminarFactura = (factura: Invoice) => {
    if (window.confirm(`¿Eliminar factura ${factura.folio}?`)) {
      setFacturas(facturas.filter(f => f.id !== factura.id));
      setSnackbar({open: true, msg: "Factura eliminada"});
    }
  };

  const handleGuardarFactura = (data: Omit<Invoice, "id" | "folio" | "client_name">) => {
    if (facturaEdit) {
      setFacturas(facturas.map(f =>
        f.id === facturaEdit.id ? { ...facturaEdit, ...data, client_name: clientesDemo.find(c => c.id === data.client_id)?.name ?? "" } : f
      ));
      setSnackbar({open: true, msg: "Factura editada"});
    } else {
      const newFactura: Invoice = {
        ...data,
        id: Date.now(),
        folio: randomFolio(),
        client_name: clientesDemo.find(c => c.id === data.client_id)?.name || "",
      };
      setFacturas([newFactura, ...facturas]);
      setSnackbar({open: true, msg: "Factura agregada"});
    }
    setModalOpen(false);
  };

  const handleRecargar = () => {
    setSnackbar({open: true, msg: "Recargado (simulado)"});
    setFacturas([...facturasDemo]);
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
      <FacturasTable
        facturas={facturasFiltradas}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10) || 5); setPage(0); }}
        onEdit={handleEditarFactura}
        onDelete={handleEliminarFactura}
      />
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