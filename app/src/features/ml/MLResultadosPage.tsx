import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getMLResultados, createMLResultado, deleteMLResultado } from "../../api/ml_resultados";

export default function MLResultadosPage() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editResultado, setEditResultado] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try { setResultados(await getMLResultados()); }
    catch { setSnackbar({ open: true, msg: "Error cargando resultados ML" }); }
    finally { setLoading(false); }
  };

  const handleNuevo = () => { setEditResultado(undefined); setModalOpen(true); };
  const handleEliminar = async (r: any) => {
    if (window.confirm("¿Eliminar resultado ML?")) { await deleteMLResultado(r.id); fetchData(); }
  };
  const handleGuardar = async (data: any) => {
    try {
      await createMLResultado(data);
      setModalOpen(false); fetchData(); setSnackbar({ open: true, msg: "Guardado" });
    } catch { setSnackbar({ open: true, msg: "Error guardando" }); }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Resultados Machine Learning</Typography>
      <Stack direction="row" spacing={2} mb={2}><Button variant="contained" onClick={handleNuevo}>Nuevo resultado ML</Button></Stack>
      {loading ? <CircularProgress /> : (
        <Box>
          {resultados.map(r => (
            <Box key={r.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Typography fontWeight={600}>Tipo: {r.type}</Typography>
              <Typography>Entidad: {r.entity_type} #{r.entity_id}</Typography>
              <Typography>Resultado: {JSON.stringify(r.result)}</Typography>
              <Typography>Puntaje: {r.score}</Typography>
              <Typography>Fecha: {r.created_at}</Typography>
              <Button size="small" color="error" onClick={() => handleEliminar(r)}>Eliminar</Button>
            </Box>
          ))}
        </Box>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Nuevo resultado ML</DialogTitle>
        <DialogContent>
          <MLResultadoForm initial={editResultado} onSave={handleGuardar} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

function MLResultadoForm({ initial, onSave, onCancel }: { initial?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState(initial || { type: "", entity_id: "", entity_type: "", result: "", score: "", created_at: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <Stack spacing={2} mt={1}>
      <TextField label="Tipo" name="type" value={form.type} onChange={handleChange} />
      <TextField label="Entidad ID" name="entity_id" value={form.entity_id} onChange={handleChange} />
      <TextField label="Entidad tipo" name="entity_type" value={form.entity_type} onChange={handleChange} />
      <TextField label="Resultado" name="result" value={form.result} onChange={handleChange} />
      <TextField label="Puntaje" name="score" value={form.score} onChange={handleChange} />
      <TextField label="Fecha" name="created_at" type="datetime-local" value={form.created_at} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => onSave(form)}>Guardar</Button>
        <Button variant="text" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}