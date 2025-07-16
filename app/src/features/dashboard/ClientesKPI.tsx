import { Card, Typography, Stack } from "@mui/material";

export default function ClientesKPI({ data }) {
  // data: igual que antes
  return (
    <Stack direction="row" spacing={2}>
      {data.map(item => (
        <Card
          key={item.segmento_ml}
          sx={{
            p: 2,
            minWidth: 120,
            bgcolor:
              item.segmento_ml === "Premium"
                ? "#43a047"
                : item.segmento_ml === "Recurrente"
                ? "#1976d2"
                : "#ffa000",
            color: "#fff",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {item.cantidad}
          </Typography>
          <Typography variant="body2">{item.segmento_ml}</Typography>
        </Card>
      ))}
    </Stack>
  );
}