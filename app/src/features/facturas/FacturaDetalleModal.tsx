import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Box,
  Chip,
  Grid,
  Tooltip,
  useTheme,
  IconButton
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface Producto {
  id: number;
  name?: string;
  description?: string;
  price?: number;
}

interface ProductoFactura {
  product_id: number;
  name?: string;
  description?: string;
  price?: number;
  quantity: number;
}

interface FacturaDetalleModalProps {
  open: boolean;
  onClose: () => void;
  factura: {
    folio?: string;
    client_name?: string;
    date?: string;
    status?: string;
    products?: ProductoFactura[];
    subtotal?: number;
    taxes?: number;
    total?: number;
    notes?: string;
  } | null;
  productos?: Producto[];
}

const statusColors: Record<string, "success" | "warning" | "error" | "info"> = {
  paid: "success",
  pending: "warning",
  canceled: "error",
  draft: "info"
};

const FacturaDetalleModal: React.FC<FacturaDetalleModalProps> = ({
  open,
  onClose,
  factura,
  productos = []
}) => {
  const theme = useTheme();
  if (!factura) return null;

  const productosArray = Array.isArray(productos) ? productos : [];
  const getProductInfo = (product_id: number) =>
    productosArray.find((p) => p.id === product_id) || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: 8,
        bgcolor: theme.palette.background.paper
      }
    }}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          pt: 2,
          pb: 2,
          pl: 3,
          pr: 1
        }}
      >
        <ReceiptLongIcon sx={{ fontSize: 32, mr: 2 }} />
        <Box flex={1}>
          Detalle de Factura
          <Typography sx={{ fontSize: 16, color: theme.palette.primary.contrastText, fontWeight: 400 }}>
            {factura.folio ? `Folio: ${factura.folio}` : ""}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: theme.palette.primary.contrastText }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 1, px: 3 }}>
        <Grid container spacing={2} mb={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {factura.client_name}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">Fecha emisión</Typography>
            <Typography variant="body1">{factura.date}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
            <Chip
              label={factura.status?.toUpperCase() || "--"}
              color={statusColors[factura.status ?? "draft"] || "default"}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box mb={1} display="flex" alignItems="center" gap={1}>
          <InfoOutlinedIcon color="primary" />
          <Typography variant="subtitle2" color="primary">
            Productos y servicios facturados
          </Typography>
        </Box>
        <Table size="small" sx={{
          borderRadius: 2,
          boxShadow: 1,
          "& th": { background: theme.palette.grey[100] },
          "& tbody tr:hover": { background: theme.palette.action.hover }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio unitario</TableCell>
              <TableCell align="right">Subtotal </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(factura.products ?? []).map((p, i) => {
              const info = getProductInfo(p.product_id);
              const name = p.name || info.name || p.product_id;
              const desc = p.description || info.description || "--";
              const price = p.price !== undefined ? p.price : info.price;
              return (
                <TableRow key={i}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell align="right">{p.quantity}</TableCell>
                  <TableCell align="right">
                    {price !== undefined ? `${price.toFixed(2)}` : "--"}
                  </TableCell>
                  <TableCell align="right">
                    {price !== undefined ? `${(price * p.quantity).toFixed(2)}` : "--"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={4}>
            <Box bgcolor={theme.palette.grey[50]} p={2} borderRadius={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2"><b>Subtotal </b></Typography>
                <Typography variant="body2"> 
                   S\.{factura.subtotal?.toFixed(2) ?? "--"}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2"><b>IGV</b></Typography>
                <Typography variant="body2">
                  S\. {factura.taxes?.toFixed(2) ?? "--"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" color="primary"><b>Total</b></Typography>
                <Typography variant="h6" color="primary">
                  S\.{factura.total?.toFixed(2) ?? "--"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {factura.notes && (
          <Box mt={3} p={2} bgcolor={theme.palette.grey[100]} borderRadius={2}>
            <Typography variant="body2" color="text.secondary"><b>Notas:</b></Typography>
            <Typography variant="body2">{factura.notes}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} variant="contained" color="primary" size="large">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaDetalleModal;