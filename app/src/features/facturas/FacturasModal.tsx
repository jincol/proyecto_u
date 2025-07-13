import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Autocomplete, MenuItem, Box
} from "@mui/material";
import type { Invoice, ProductItem } from "../../types/invoice";

interface FacturaModalProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (invoice: Omit<Invoice, "id" | "folio" | "client_name">) => void;
  invoice?: Invoice;
  clientes?: Array<{ id: number; name: string }>;
  productos?: Array<{ product_id: number; name: string }>;
}

export default function FacturaModal({
  open,
  onClose,
  onGuardar,
  invoice,
  clientes = [],
  productos = [],
}: FacturaModalProps) {
  const [form, setForm] = useState<Omit<Invoice, "id" | "folio" | "client_name">>({
    client_id: 0,
    date: "",
    due_date: "",
    subtotal: 0,
    taxes: 0,
    total: 0,
    notes: "",
    payment_method: "",
    accounts_receivable: 0,
    status: "pending",
    products: [],
  });

  useEffect(() => {
    if (invoice) {
      const { id, folio, client_name, ...rest } = invoice;
      setForm({ ...rest });
    } else {
      setForm({
        client_id: 0,
        date: "",
        due_date: "",
        subtotal: 0,
        taxes: 0,
        total: 0,
        notes: "",
        payment_method: "",
        accounts_receivable: 0,
        status: "pending",
        products: [],
      });
    }
  }, [invoice, open]);

  useEffect(() => {
    const subtotal = (form.products ?? []).reduce((acc, p) => acc + (p.unit_price || 0) * (p.quantity || 0), 0);
    const taxes = subtotal * 0.18;
    const total = subtotal + taxes;
    setForm(f => ({ ...f, subtotal, taxes, total }));
  }, [form.products]);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{invoice ? "Editar factura" : "Nueva factura"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={clientes}
              getOptionLabel={o => o.name}
              value={(clientes ?? []).find(c => c.id === form.client_id) || null}
              onChange={(_, v) => handleChange("client_id", v?.id || 0)}
              renderInput={params => <TextField {...params} label="Cliente" required />}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Fecha emisión"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={e => handleChange("date", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Fecha vencimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.due_date}
              onChange={e => handleChange("due_date", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box mb={1}>Productos:</Box>
            {(form.products ?? []).map((p, i) => (
              <Box key={i} display="flex" gap={1} mb={1}>
                <Autocomplete
                  options={productos}
                  getOptionLabel={o => o.name}
                  value={(productos ?? []).find(prod => prod.product_id === p.product_id) || null}
                  onChange={(_, v) => {
                    const items = [...form.products];
                    items[i].product_id = v?.product_id || 0;
                    items[i].name = v?.name || "";
                    handleChange("products", items);
                  }}
                  sx={{ flex: 2 }}
                  renderInput={params => <TextField {...params} label="Producto" />}
                />
                <TextField
                  type="number"
                  label="Cantidad"
                  value={p.quantity}
                  onChange={e => {
                    const items = [...form.products];
                    items[i].quantity = Number(e.target.value);
                    handleChange("products", items);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  type="number"
                  label="Precio"
                  value={p.unit_price}
                  onChange={e => {
                    const items = [...form.products];
                    items[i].unit_price = Number(e.target.value);
                    handleChange("products", items);
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  color="error"
                  onClick={() => {
                    const items = [...form.products];
                    items.splice(i, 1);
                    handleChange("products", items);
                  }}
                >
                  Quitar
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() =>
                handleChange("products", [
                  ...form.products,
                  { product_id: 0, name: "", quantity: 1, unit_price: 0 }
                ])
              }
            >
              + Producto
            </Button>
          </Grid>
          <Grid item xs={4}>
            <TextField label="Subtotal" value={form.subtotal.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="IGV" value={form.taxes.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Total" value={form.total.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Método de pago"
              value={form.payment_method || ""}
              onChange={e => handleChange("payment_method", e.target.value)}
              fullWidth
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Estado"
              value={form.status}
              onChange={e => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="paid">Pagada</MenuItem>
              <MenuItem value="cancelled">Cancelada</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notas"
              value={form.notes}
              onChange={e => handleChange("notes", e.target.value)}
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cuentas por cobrar"
              type="number"
              value={form.accounts_receivable ?? 0}
              onChange={e => handleChange("accounts_receivable", Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onGuardar(form)} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}