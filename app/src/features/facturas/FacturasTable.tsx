import React from "react";
import {
  Table, TableHead, TableBody, TableCell, TableRow, TableContainer, TablePagination,
  IconButton, Tooltip, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Invoice } from "../../types/invoice";

interface FacturasTableProps {
  facturas: Invoice[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export default function FacturasTable({
  facturas, page, rowsPerPage,
  onPageChange, onRowsPerPageChange,
  onEdit, onDelete
}: FacturasTableProps) {
  const pagedFacturas = facturas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ marginY: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Folio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedFacturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay facturas.</TableCell>
              </TableRow>
            ) : (
              pagedFacturas.map(f => (
                <TableRow key={f.id}>
                  <TableCell>{f.folio}</TableCell>
                  <TableCell>{f.date.substring(0, 10)}</TableCell>
                  <TableCell>{f.client_name}</TableCell>
                  <TableCell>${f.total.toFixed(2)}</TableCell>
                  <TableCell>{f.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton color="primary" size="small" onClick={() => onEdit(f)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" size="small" onClick={() => onDelete(f)}>
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
      <TablePagination
        component="div"
        count={facturas.length}
        page={page}
        rowsPerPage={rowsPerPage ?? 5}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}