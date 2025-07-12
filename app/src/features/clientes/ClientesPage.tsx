import { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { getClientes } from "../../api/clientes";
import ClienteForm from "./ClienteForm";

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);
  return (
    <Box>
      <Typography variant="h5" mb={2}>Clientes</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>Nuevo Cliente</Button>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente: any) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {openForm && <ClienteForm onClose={() => setOpenForm(false)} />}
    </Box>
  );
}