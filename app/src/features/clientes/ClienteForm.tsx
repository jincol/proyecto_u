import { Box, TextField, Button } from "@mui/material";

export default function ClienteForm({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ p: 2 }}>
      <form>
        <TextField label="Nombre" fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" fullWidth sx={{ mb: 2 }} />
        <TextField label="Teléfono" fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Guardar</Button>
        <Button variant="outlined" onClick={onClose}>Cancelar</Button>
      </form>
    </Box>
  );
}