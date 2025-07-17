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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PrediccionMLCard from "../dashboard/PrediccionMLCard"; // Asegúrate de tener este componente

// Colores para los segmentos ML
const SEGMENT_COLORS = {
  "Premium": "#43a047",
  "Recurrente": "#1976d2",
  "En riesgo": "#ffa000",
  "Sin segmento": "#bdbdbd",
};

function segmentoColor(segmento) {
  return (
    SEGMENT_COLORS[segmento] ||
    SEGMENT_COLORS["Sin segmento"]
  );
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState(""); // Nuevo: filtro de segmento
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

  // ML Prediction modal states
  const [openPrediccion, setOpenPrediccion] = useState(false);
  const [prediccionData, setPrediccionData] = useState(null);
  const [loadingPrediccion, setLoadingPrediccion] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    setLoading(true);
    axios.get("http://localhost:8000/clients")
      .then(res => setClientes(res.data))
      .finally(() => setLoading(false));
  };

  const fetchPrediccionML = async (clientId) => {
    setLoadingPrediccion(true);
    setPrediccionData(null);
    try {
      const resp = await axios.get(`http://localhost:8000/ml-results/prediccion-ventas?entity_id=${clientId}`);
      // Ajusta según el output real de tu API
      setPrediccionData(resp.data.result || resp.data);
    } catch {
      setPrediccionData(null);
    } finally {
      setLoadingPrediccion(false);
    }
  };

  // Filtrado por búsqueda y segmento
  const filtered = clientes.filter(
    cli =>
      (cli.name.toLowerCase().includes(search.toLowerCase()) ||
      (cli.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (cli.phone || "").toLowerCase().includes(search.toLowerCase())) &&
      (!segmentFilter || cli.segmento_ml === segmentFilter)
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

  // ML Prediction Modal
  const handleOpenPrediccion = (cliente) => {
    setOpenPrediccion(true);
    setSelectedCliente(cliente);
    fetchPrediccionML(cliente.id);
  };
  const handleClosePrediccion = () => {
    setOpenPrediccion(false);
    setPrediccionData(null);
    setSelectedCliente(null);
  };

  // Extrae los segmentos únicos para el filtro
  const segmentosUnicos = Array.from(
    new Set(clientes.map(c => c.segmento_ml).filter(Boolean))
  );

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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Segmento ML</InputLabel>
            <Select
              value={segmentFilter}
              label="Segmento ML"
              onChange={e => setSegmentFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {segmentosUnicos.map(seg => (
                <MenuItem key={seg} value={seg}>
                  {seg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
                <TableCell>Segmento ML</TableCell>
                <TableCell>Predicción ML</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
                    {/* NUEVO: Segmento ML */}
                    <TableCell>
                      {cli.segmento_ml ? (
                        <Chip
                          label={cli.segmento_ml}
                          size="small"
                          sx={{
                            bgcolor: segmentoColor(cli.segmento_ml),
                            color: "#fff",
                            fontWeight: "bold",
                            letterSpacing: 0.5,
                            fontSize: 14,
                          }}
                        />
                      ) : (
                        <Chip label="Sin segmento" size="small" variant="outlined" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver predicción de ventas ML">
                        <span>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleOpenPrediccion(cli)}
                          >
                            <ShowChartIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
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

      {/* Modal para mostrar predicción ML */}
      <Dialog open={openPrediccion} onClose={handleClosePrediccion} maxWidth="sm" fullWidth>
        <DialogTitle>
          Predicción automática ML
          {selectedCliente && (
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
              {selectedCliente.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {loadingPrediccion ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : prediccionData ? (
            <PrediccionMLCard resultado={prediccionData} />
          ) : (
            <Typography color="text.secondary">
              No hay predicción disponible para este cliente.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrediccion} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}