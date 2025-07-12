import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getSegmentos, createSegmento, deleteSegmento } from "../../api/segmentos";

export default function SegmentosPage() {
  const [segmentos, setSegmentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSegmento, setEditSegmento] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try { setSegmentos(await getSegmentos()); }
    catch { setSnackbar({ open: true, msg: "Error cargando segmentos" }); }
    finally { setLoading(false); }
  };

  const handleNuevo = () => { setEditSegmento(undefined); setModalOpen(true); };
  const handleEliminar = async (s: any) => {
    if (window.confirm("¿Eliminar segmento?")) { await deleteSegmento(s.id); fetchData(); }
  };
  const handleGuardar = async (data: any) => {
    try {
      await createSegmento(data);
      setModalOpen(false); fetchData(); setSnackbar({ open: true, msg: "Guardado" });
    } catch { setSnackbar({ open: true, msg: "Error guardando" }); }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Segmentos de clientes</Typography>
      <Stack direction="row" spacing={2} mb={2}><Button variant="contained" onClick={handleNuevo}>Nuevo segmento</Button></Stack>
      {loading ? <CircularProgress /> : (
        <Box>
          {segmentos.map(s => (
            <Box key={s.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Typography fontWeight={600}>{s.name}</Typography>
              <Typography>{s.description}</Typography>
              <Button size="small" color="error" onClick={() => handleEliminar(s)}>Eliminar</Button>
            </Box>
          ))}
        </Box>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Nueva segmento</DialogTitle>
        <DialogContent>
          <SegmentoForm initial={editSegmento} onSave={handleGuardar} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

function SegmentoForm({ initial, onSave, onCancel }: { initial?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(initial || { name: "", description: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <Stack spacing={2} mt={1}>
      <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} />
      <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => onSave(form)}>Guardar</Button>
        <Button variant="text" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}