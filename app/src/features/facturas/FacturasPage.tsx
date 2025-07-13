import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, InputAdornment, Button, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getFacturas, deleteFactura } from "../../api/facturas";
import FacturasTable from "./FacturasTable";
import FacturasModal from "./FacturasModal";
import FacturaDetalleModal from "./FacturaDetalleModal";
import axios from "axios";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editFactura, setEditFactura] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [facturaDetalle, setFacturaDetalle] = useState(null);
  const [productosCatalogo, setProductosCatalogo] = useState([]);

  useEffect(() => {
    loadFacturas();
    fetchClientes();
    fetchProductos();
    // Catálogo completo de productos (para cruzar en detalle)
    axios.get("/api/products")
      .then(res => setProductosCatalogo(res.data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);

  const loadFacturas = () => {
    setLoading(true);
    getFacturas()
      .then(setFacturas)
      .finally(() => setLoading(false));
  };

  const fetchClientes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/clients");
      setClientes(res.data);
    } catch { setClientes([]); }
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProductos(res.data);
    } catch { setProductos([]); }
  };

  const handleEdit = (factura) => {
    setEditFactura(factura);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteFactura(id);
    loadFacturas();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditFactura(null);
    loadFacturas();
  };

  const handleNuevaFactura = () => {
    setEditFactura(null);
    setModalOpen(true);
  };

  // ⚡️ FUNCION CLAVE: Al ver detalle, pide el detalle real al backend
  const handleViewDetalle = async (factura) => {
    try {
      // ¡Pide el detalle real (no uses el objeto del listado)!
      const res = await axios.get(`http://localhost:8000/invoices/${factura.id}`);
      setFacturaDetalle(res.data);
      setDetalleOpen(true);
    } catch (error) {
      alert("No se pudo cargar el detalle de la factura");
      setFacturaDetalle(null);
      setDetalleOpen(false);
    }
  };

  const filtered = facturas.filter(
    f =>
      f.folio?.toLowerCase().includes(search.toLowerCase()) ||
      (f.client_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Gestión de Facturas</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleNuevaFactura}
        >
          NUEVA FACTURA
        </Button>
        <Button variant="outlined" color="secondary" onClick={loadFacturas}>
          RECARGAR
        </Button>
        <TextField
          label="Buscar folio o cliente"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
          }}
        />
      </Box>
      <Paper>
        {loading ? (
          <CircularProgress sx={{ m: 4 }} />
        ) : (
          <FacturasTable
            facturas={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetalle={handleViewDetalle} // ← ¡Aquí pasas la función que pide el detalle!
          />
        )}
      </Paper>
      <FacturasModal
        open={modalOpen}
        onClose={handleCloseModal}
        invoice={editFactura}
        clientes={clientes}
        productos={productos}
        onGuardar={handleCloseModal}
      />
      <FacturaDetalleModal
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        factura={facturaDetalle}
        productos={productosCatalogo}
      />
    </Box>
  );
}