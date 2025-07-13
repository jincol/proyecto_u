import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Autocomplete, MenuItem, Box
} from "@mui/material";
import { createFactura } from "../../api/facturas";

interface ProductItem {
  product_id: number;
  quantity: number;
}

interface FacturaModalProps {
  open: boolean;
  onClose: () => void;
  onGuardar: (invoice: any) => void;
  invoice?: any;
  clientes?: Array<{ id: number; name: string }>;
  productos?: Array<{ id: number; name: string; price?: number }>;
}

export default function FacturaModal({
  open,
  onClose,
  onGuardar,
  invoice,
  clientes = [],
  productos = [],
}: FacturaModalProps) {

  const [form, setForm] = useState({
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
    products: [] as ProductItem[],
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
    const subtotal = (form.products ?? []).reduce((acc, p) => {
      const prod = productos.find(prod => prod.id === p.product_id);
      return acc + ((prod?.price || 0) * (p.quantity || 0));
    }, 0);
    const taxes = subtotal * 0.18;
    const total = subtotal + taxes;
    setForm(f => ({ ...f, subtotal, taxes, total }));
  }, [form.products, productos]);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleProductFieldChange = (i: number, field: keyof ProductItem, value: any) => {
    const items = [...form.products];
    items[i] = { ...items[i], [field]: value };
    setForm(f => ({ ...f, products: items }));
  };

  const handleProductSelect = (i: number, v: { id: number } | null) => {
    const items = [...form.products];
    items[i] = {
      ...items[i],
      product_id: v?.id ?? 0,
    };
    setForm(f => ({ ...f, products: items }));
  };

  const handleAddProduct = () => {
    setForm(f => ({
      ...f,
      products: [...f.products, { product_id: 0, quantity: 1 }]
    }));
  };

  const handleRemoveProduct = (i: number) => {
    const items = [...form.products];
    items.splice(i, 1);
    setForm(f => ({ ...f, products: items }));
  };

  const handleGuardar = async () => {
    if (!form.client_id) {
      alert("Selecciona un cliente");
      return;
    }
    if (!form.date) {
      alert("Selecciona fecha de emisión");
      return;
    }
    if (!form.products.length) {
      alert("Agrega al menos un producto");
      return;
    }
    for (const p of form.products) {
      if (!p.product_id || p.quantity < 1) {
        alert("Verifica todos los productos seleccionados. No puede haber producto vacío.");
        return;
      }
    }
    const facturaPayload = {
      folio: `F${Math.floor(Math.random() * 10000)}`,
      client_id: form.client_id,
      products: form.products.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
      })),
      total: form.total,
      date: new Date(form.date).toISOString(),
      status: form.status,
      notes: form.notes
    };
    try {
      await createFactura(facturaPayload);
      if (onGuardar) onGuardar(facturaPayload);
      onClose();
    } catch (err) {
      console.error("Error al guardar en backend:", err);
      alert("Error al guardar la factura. Revisa consola.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{invoice ? "Editar factura" : "Nueva factura"}</DialogTitle>
      <DialogContent>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(3, 1fr)">
          <Autocomplete
            options={clientes}
            getOptionLabel={o => o.name}
            value={clientes.find(c => c.id === form.client_id) || null}
            onChange={(_, v) => handleChange("client_id", v?.id || 0)}
            renderInput={params => <TextField {...params} label="Cliente*" required fullWidth />}
          />
          <TextField
            label="Fecha emisión"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={e => handleChange("date", e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Fecha vencimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.due_date}
            onChange={e => handleChange("due_date", e.target.value)}
            required
            fullWidth
          />
        </Box>
        {(form.products ?? []).map((p, i) => (
          <Box key={i} display="grid" gap={2} gridTemplateColumns="2fr 1fr 1fr 1fr" alignItems="center" margin="10px 0">
            <Autocomplete
              options={productos}
              getOptionLabel={o => o.name}
              value={productos.find(prod => prod.id === p.product_id) || null}
              onChange={(_, v) => handleProductSelect(i, v)}
              renderInput={params => <TextField {...params} label="Producto" fullWidth />}
            />
            <TextField
              type="number"
              label="Cantidad"
              value={p.quantity}
              onChange={e => handleProductFieldChange(i, "quantity", Number(e.target.value))}
              fullWidth
            />
            <Button
              color="error"
              size="small"
              onClick={() => handleRemoveProduct(i)}
            >
              Quitar
            </Button>
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" fullWidth onClick={handleAddProduct}>
            + AGREGAR PRODUCTO
          </Button>
        </Box>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(3, 1fr)" mt={2}>
          <TextField label="Subtotal" value={form.subtotal.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
          <TextField label="IGV" value={form.taxes.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
          <TextField label="Total" value={form.total.toFixed(2)} fullWidth InputProps={{ readOnly: true }} />
        </Box>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(3, 1fr)" mt={2}>
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
          <TextField
            label="Cuentas por cobrar"
            type="number"
            value={form.accounts_receivable ?? 0}
            onChange={e => handleChange("accounts_receivable", Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Notas"
            value={form.notes}
            onChange={e => handleChange("notes", e.target.value)}
            fullWidth
            multiline
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}