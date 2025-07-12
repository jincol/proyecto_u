import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert,
} from "@mui/material";
import {
  getPagos,
  createPago,
  updatePago,
  deletePago
} from "../../api/pagos";

export default function PagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPago, setEditPago] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try { setPagos(await getPagos()); }
    catch { setSnackbar({ open: true, msg: "Error cargando pagos" }); }
    finally { setLoading(false); }
  };

  const handleNuevo = () => { setEditPago(undefined); setModalOpen(true); };
  const handleEditar = (p: any) => { setEditPago(p); setModalOpen(true); };
  const handleEliminar = async (p: any) => {
    if (window.confirm("¿Eliminar pago?")) { await deletePago(p.id); fetchData(); }
  };
  const handleGuardar = async (data: any) => {
    try {
      if (editPago) { await updatePago(editPago.id, data); }
      else { await createPago(data); }
      fetchData();
      setModalOpen(false);
      setSnackbar({ open: true, msg: "Pago guardado correctamente" });
    } catch {
      setSnackbar({ open: true, msg: "Error guardando pago" });
    }
  };

  // ... aquí iría tu interfaz y renderizado de la tabla de pagos, modal, etc.
  return (
    <Box>
      <Typography variant="h4">Pagos</Typography>
      {/* Aquí renderizas la lista de pagos y manejas la UI */}
      {/* Snackbar de errores */}
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar(null)}>
        {snackbar && <Alert severity="error">{snackbar.msg}</Alert>}
      </Snackbar>
    </Box>
  );
}