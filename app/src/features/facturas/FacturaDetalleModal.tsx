import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Table, TableHead, TableRow, TableCell, TableBody, Divider, Box
} from "@mui/material";

export default function FacturaDetalleModal({ open, onClose, factura, productos = [] }) {
  if (!factura) return null;

  // Helper para buscar info del producto en el catálogo
  const getProductInfo = (product_id) => productos.find(p => p.id === product_id) || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle de Factura</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle1"><b>Folio:</b> {factura.folio}</Typography>
          <Typography variant="subtitle1"><b>Cliente:</b> {factura.client_name}</Typography>
          <Typography variant="subtitle1"><b>Fecha emisión:</b> {factura.date}</Typography>
          <Typography variant="subtitle1"><b>Estado:</b> {factura.status}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" mb={1}>Productos:</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio unitario</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(factura.products ?? []).map((p, i) => {
              const info = getProductInfo(p.product_id);
              return (
                <TableRow key={i}>
                  <TableCell>{info.name || p.product_id}</TableCell>
                  <TableCell>{info.description || "--"}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{info.price !== undefined ? `$${info.price.toFixed(2)}` : "--"}</TableCell>
                  <TableCell>
                    {info.price !== undefined ? `$${(info.price * p.quantity).toFixed(2)}` : "--"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end" gap={4}>
          <Typography><b>Subtotal:</b> ${factura.subtotal?.toFixed(2) ?? "--"}</Typography>
          <Typography><b>IGV:</b> ${factura.taxes?.toFixed(2) ?? "--"}</Typography>
          <Typography><b>Total:</b> ${factura.total?.toFixed(2) ?? "--"}</Typography>
        </Box>
        {factura.notes && (
          <Box mt={2}>
            <Typography variant="body2"><b>Notas:</b> {factura.notes}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}