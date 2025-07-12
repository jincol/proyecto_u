import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null); // cliente en edición
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    setLoading(true);
    axios.get("http://localhost:8000/clients")
      .then(res => setClientes(res.data))
      .finally(() => setLoading(false));
  };

  const filtered = clientes.filter(
    cli =>
      cli.name.toLowerCase().includes(search.toLowerCase()) ||
      (cli.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (cli.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  // EDICIÓN
  const handleOpenModal = (cliente = null) => {
    setOpenModal(true);
    setEditing(cliente);
    setForm(
      cliente
        ? {
            name: cliente.name || "",
            email: cliente.email || "",
            phone: cliente.phone || "",
            address: cliente.address || "",
          }
        : { name: "", email: "", phone: "", address: "" }
    );
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditing(null);
    setForm({ name: "", email: "", phone: "", address: "" });
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        // EDITAR
        await axios.put(`http://localhost:8000/clients/${editing.id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        });
      } else {
        // AGREGAR
        await axios.post("http://localhost:8000/clients", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        });
      }
      fetchClientes();
      handleCloseModal();
    } finally {
      setSaving(false);
    }
  };

  // ELIMINAR
  const handleOpenDelete = id => {
    setOpenDelete(true);
    setDeleteId(id);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await axios.delete(`http://localhost:8000/clients/${deleteId}`);
    fetchClientes();
    handleCloseDelete();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Clientes
        </Typography>
        <Tooltip title="Agregar cliente">
          <IconButton color="primary" onClick={() => handleOpenModal(null)}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          label="Buscar cliente"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay clientes.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cli) => (
                  <TableRow key={cli.id}>
                    <TableCell>
                      <Typography fontWeight="bold">{cli.name}</Typography>
                    </TableCell>
                    <TableCell>{cli.email}</TableCell>
                    <TableCell>
                      {cli.phone ? (
                        <Chip
                          label={cli.phone}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      ) : "-"}
                    </TableCell>
                    <TableCell>{cli.address || "-"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenModal(cli)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDelete(cli.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para agregar/editar cliente */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Dirección"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={saving}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={
              saving ||
              !form.name
            }
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>¿Eliminar cliente?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}