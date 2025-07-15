import React, { useEffect, useState } from "react";
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
  Autocomplete
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getInventario, createInventario, updateInventario, deleteInventario } from "../../api/inventario";
import { getProductos, createProducto, updateProducto } from "../../api/productos";

export default function InventarioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchInventario();
    fetchProductos();
  }, []);

  const fetchInventario = () => {
    setLoading(true);
    getInventario()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  const fetchProductos = () => {
    getProductos().then(setProductos);
  };

  const handleGuardarInventario = async (form) => {
    let product_id = form.product_id;
    // Si es producto nuevo (no tiene product_id), crear producto primero
    if (!form.product_id) {
      const newProd = await createProducto({
        name: form.name,
        description: form.description,
        price: form.price
      });
      product_id = newProd.id;
    } else {
      // Actualizar producto existente
      await updateProducto(product_id, {
        name: form.name,
        description: form.description,
        price: form.price
      });
    }
    if (selectedItem) {
      // Editar inventario existente
      await updateInventario(selectedItem.id, { quantity: form.quantity });
    } else {
      // Crear inventario
      await createInventario({ product_id, quantity: form.quantity });
    }
    fetchInventario();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro de inventario?")) {
      await deleteInventario(id);
      fetchInventario();
    }
  };

  const filtered = items.filter(
    item =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Inventario de Productos
        </Typography>
        <Tooltip title="Agregar producto al inventario">
          <IconButton
            color="primary"
            onClick={() => { setSelectedItem(null); setModalOpen(true); }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          label="Buscar producto"
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
                <TableCell>Producto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay productos en inventario.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography fontWeight="bold">{item.name}</Typography>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.quantity}
                        color={
                          item.quantity === 0
                            ? "error"
                            : item.quantity < 5
                            ? "warning"
                            : "success"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.id)}
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

      <InventarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        inventario={selectedItem}
        productos={productos}
        onGuardar={handleGuardarInventario}
      />
    </Box>
  );
}

function InventarioModal({ open, onClose, inventario, onGuardar }) {
  // Si es edición, llenar producto y cantidad; si es nuevo, campos vacíos
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0
  });

  useEffect(() => {
    if (inventario) {
      setForm({
        name: inventario.name,
        description: inventario.description,
        price: inventario.price,
        quantity: inventario.quantity
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        quantity: 0
      });
    }
  }, [inventario, open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || form.price < 0 || form.quantity < 0) {
      alert("Completa los datos correctamente");
      return;
    }
    await onGuardar(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{inventario ? "Editar producto/inventario" : "Agregar producto/inventario"}</DialogTitle>
      <DialogContent>
        <Box display="grid" gap={2} gridTemplateColumns="1fr">
          <TextField
            label="Nombre *"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            disabled={!!inventario} // Solo lectura en edición
          />
          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Precio *"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Cantidad *"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}