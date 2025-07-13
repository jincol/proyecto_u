import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Divider,
  Box,
} from "@mui/material";

type Product = {
  product_id: number;
  name: string;
  quantity: number;
  precio?: number; // puede venir como price en el backend
  price?: number;
  subtotal?: number;
};

type Factura = {
  folio: string;
  date: string;
  client_name: string;
  status: string;
  subtotal?: number;
  taxes?: number;
  total?: number;
  notes?: string;
  products: Product[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
}

const FacturaDetalleModal: React.FC<Props> = ({ open, onClose, factura }) => {
  if (!factura) return null;

  // Helper para obtener precio y subtotal considerando ambas opciones
  const getPrecio = (producto: Product) => {
    const val = producto.precio ?? producto.price;
    return val !== undefined && val !== null ? `$${Number(val).toFixed(2)}` : "--";
  };
  const getSubtotal = (producto: Product) => {
    const val = producto.subtotal;
    return val !== undefined && val !== null ? `$${Number(val).toFixed(2)}` : "--";
  };

  const formatNumber = (num?: number) =>
    num !== undefined && num !== null ? `$${Number(num).toFixed(2)}` : "--";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <span>Factura #{factura.folio}</span>
          <span style={{ color: factura.status === "anulada" ? "#e53935" : "#43a047" }}>
            {factura.status ? factura.status.toUpperCase() : ""}
          </span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          Cliente: <b>{factura.client_name}</b>
        </Typography>
        <Typography variant="subtitle2">
          Fecha: {factura.date}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio unitario</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factura.products.map((producto) => (
              <TableRow key={producto.product_id}>
                <TableCell>{producto.name}</TableCell>
                <TableCell>{producto.quantity}</TableCell>
                <TableCell>{getPrecio(producto)}</TableCell>
                <TableCell>{getSubtotal(producto)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="flex-end">
          <Typography>Subtotal: {formatNumber(factura.subtotal)}</Typography>
          <Typography>Impuestos: {formatNumber(factura.taxes)}</Typography>
          <Typography variant="h6">Total: {formatNumber(factura.total)}</Typography>
        </Box>
        {factura.notes && (
          <Box mt={2}>
            <Typography variant="body2">Notas: {factura.notes}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaDetalleModal;