import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getRecurrencias, createRecurrencia, updateRecurrencia, deleteRecurrencia } from "../../api/recurrencias";

export default function RecurrenciasPage() {
  const [recurrencias, setRecurrencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecurrencia, setEditRecurrencia] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setRecurrencias(await getRecurrencias());
    } catch {
      setSnackbar({ open: true, msg: "Error cargando recurrencias" });
    } finally {
      setLoading(false);
    }
  };

  const handleNueva = () => {
    setEditRecurrencia(undefined);
    setModalOpen(true);
  };

  const handleEditar = (item: any) => {
    setEditRecurrencia(item);
    setModalOpen(true);
  };

  const handleEliminar = async (item: any) => {
    if (window.confirm("¿Eliminar recurrencia?")) {
      await deleteRecurrencia(item.id);
      fetchData();
    }
  };

  const handleGuardar = async (data: any) => {
    try {
      if (editRecurrencia) {
        await updateRecurrencia(editRecurrencia.id, data);
      } else {
        await createRecurrencia(data);
      }
      setModalOpen(false);
      fetchData();
      setSnackbar({ open: true, msg: "Guardado" });
    } catch {
      setSnackbar({ open: true, msg: "Error guardando" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Recurrencias</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleNueva}>Nueva recurrencia</Button>
      </Stack>
      {loading ? <CircularProgress /> : (
        <Box>
          {recurrencias.map(rec => (
            <Box key={rec.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Typography fontWeight={600}>Cliente: {rec.client_id}</Typography>
              <Typography>Tipo: {rec.type}</Typography>
              <Typography>Siguiente: {rec.next_date}</Typography>
              <Typography>Activa: {rec.is_active ? "Sí" : "No"}</Typography>
              <Button size="small" onClick={() => handleEditar(rec)}>Editar</Button>
              <Button size="small" color="error" onClick={() => handleEliminar(rec)}>Eliminar</Button>
            </Box>
          ))}
        </Box>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editRecurrencia ? "Editar" : "Nueva"} recurrencia</DialogTitle>
        <DialogContent>
          <RecurrenciaForm
            initial={editRecurrencia}
            onSave={handleGuardar}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

function RecurrenciaForm({ initial, onSave, onCancel }: { initial?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(initial || { client_id: "", type: "", next_date: "", is_active: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Stack spacing={2} mt={1}>
      <TextField label="Cliente ID" name="client_id" value={form.client_id} onChange={handleChange} />
      <TextField label="Tipo" name="type" value={form.type} onChange={handleChange} />
      <TextField label="Siguiente Fecha" name="next_date" type="date" value={form.next_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => onSave(form)}>Guardar</Button>
        <Button variant="text" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}