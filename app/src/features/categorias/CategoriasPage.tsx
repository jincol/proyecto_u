import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Stack, TextField, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { getCategorias, createCategoria, deleteCategoria } from "../../api/categorias";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<any | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string } | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try { setCategorias(await getCategorias()); }
    catch { setSnackbar({ open: true, msg: "Error cargando categorías" }); }
    finally { setLoading(false); }
  };

  const handleNuevo = () => { setEditCategoria(undefined); setModalOpen(true); };
  const handleEliminar = async (c: any) => {
    if (window.confirm("¿Eliminar categoría?")) { await deleteCategoria(c.id); fetchData(); }
  };
  const handleGuardar = async (data: any) => {
    try {
      await createCategoria(data);
      setModalOpen(false); fetchData(); setSnackbar({ open: true, msg: "Guardado" });
    } catch { setSnackbar({ open: true, msg: "Error guardando" }); }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Categorías de productos</Typography>
      <Stack direction="row" spacing={2} mb={2}><Button variant="contained" onClick={handleNuevo}>Nueva categoría</Button></Stack>
      {loading ? <CircularProgress /> : (
        <Box>
          {categorias.map(c => (
            <Box key={c.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Typography fontWeight={600}>{c.name}</Typography>
              <Typography>{c.description}</Typography>
              <Button size="small" color="error" onClick={() => handleEliminar(c)}>Eliminar</Button>
            </Box>
          ))}
        </Box>
      )}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Nueva categoría</DialogTitle>
        <DialogContent>
          <CategoriaForm initial={editCategoria} onSave={handleGuardar} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
      <Snackbar open={!!snackbar?.open} autoHideDuration={2000} onClose={() => setSnackbar(null)}>
        <Alert severity="success" variant="filled">{snackbar?.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

function CategoriaForm({ initial, onSave, onCancel }: { initial?: any, onSave: (data: any) => void, onCancel: () => void }) {
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