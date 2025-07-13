import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FacturasTable({ facturas, onEdit, onDelete }) {
  return (
    <TableContainer>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Folio</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facturas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No hay facturas.</TableCell>
            </TableRow>
          ) : (
            facturas.map(f => (
              <TableRow key={f.id}>
                <TableCell>{f.folio}</TableCell>
                <TableCell>{new Date(f.date).toLocaleDateString()}</TableCell>
                <TableCell>{f.client_name}</TableCell>
                <TableCell>${f.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={f.status}
                    color={
                      f.status === "paid"
                        ? "success"
                        : f.status === "pending"
                        ? "warning"
                        : f.status === "cancelled"
                        ? "default"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => onEdit(f)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => onDelete(f.id)}>
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
  );
}