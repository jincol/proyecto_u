import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getNotificaciones, createNotificacion, updateNotificacion, deleteNotificacion } from "../../api/notificaciones";

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNotificacion, setEditNotificacion] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try { setNotificaciones(await getNotificaciones()); }
    catch { setSnackbar({ open: true, msg: "Error cargando notificaciones" }); }
    finally { setLoading(false); }
  };

  const handleNueva = () => { setEditNotificacion(undefined); setModalOpen(true); };
  const handleEditar = (n: any) => { setEditNotificacion(n); setModalOpen(true); };
  const handleEliminar = async (n: any) => {
    if (window.confirm("¿Eliminar notificación?")) { await deleteNotificacion(n.id); fetchData(); }
  };
  const handleGuardar = async (data: any) => {
    try {
      if (editNotificacion) await updateNotificacion(editNotificacion.id, data);
      else await createNotificacion(data);
      setModalOpen(false); fetchData(); setSnackbar({ open: true, msg: "Guardado" });
    } catch { setSnackbar({ open: true, msg: "Error guardando" }); }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Notificaciones</Typography>
      <Stack direction="row" spacing={2} mb={2}><Button variant="contained" onClick={handleNueva}>Nueva notificación</Button></Stack>
      {loading ? <CircularProgress /> : (
        <Box>
          {notificaciones.map(n => (
            <Box key={n.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Typography fontWeight={600}>Tipo: {n.type}</Typography>
              <Typography>Mensaje: {n.message}</Typography>
              <Typography>Fecha: {n.date}</Typography>
              <Typography>Leída: {n.is_read ? "Sí" : "No"}</Typography>
              <Button size="small" onClick={() => handleEditar(n)}>Editar</Button>
              <Button size="small" color="error" onClick={() => handleEliminar(n)}>Eliminar</Button>
            </Box>
          ))}
        </Box>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editNotificacion ? "Editar" : "Nueva"} notificación</DialogTitle>
        <DialogContent>
          <NotificacionForm initial={editNotificacion} onSave={handleGuardar} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

function NotificacionForm({ initial, onSave, onCancel }: { initial?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(initial || { type: "", message: "", date: "", is_read: false });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <Stack spacing={2} mt={1}>
      <TextField label="Tipo" name="type" value={form.type} onChange={handleChange} />
      <TextField label="Mensaje" name="message" value={form.message} onChange={handleChange} />
      <TextField label="Fecha" name="date" type="datetime-local" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => onSave(form)}>Guardar</Button>
        <Button variant="text" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}