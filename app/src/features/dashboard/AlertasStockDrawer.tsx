import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AlertasStockDrawer({ open, onClose, productos }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Productos con Stock Bajo</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {productos.length === 0 ? (
          <Typography color="text.secondary">No hay productos con stock bajo.</Typography>
        ) : (
          <List>
            {productos.map(prod => (
              <ListItem key={prod.id} secondaryAction={
                <Chip label={`Stock: ${prod.quantity}`} color={prod.quantity === 0 ? "error" : "warning"} />
              }>
                <ListItemText
                  primary={prod.name}
                  secondary={prod.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}