import { Paper, Typography, Box, Divider, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function PrediccionMLCard({ resultado }: { resultado: any }) {
  if (!resultado) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        mt: 2,
        bgcolor: "#e8fff5",
        color: "#207244",
        maxWidth: 420,
        minWidth: 320,
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <TrendingUpIcon fontSize="large" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={700}>
          Predicción automática ML
        </Typography>
      </Box>
      <Typography variant="body1" mb={1}>
        Cliente: <b>{resultado.cliente}</b>
        {resultado.segmento && (
          <span style={{ marginLeft: 8, fontStyle: "italic", color: "#1976d2" }}>
            [{resultado.segmento}]
          </span>
        )}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: 18 }}>
        Próxima venta estimada: <b>
          S/ {Number(resultado.ventas_predichas).toLocaleString("es-PE", { maximumFractionDigits: 2 })}
        </b> para <b>{resultado.periodo_predicho}</b>
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Basado en análisis de IA de tu histórico de ventas.
      </Typography>
      {resultado.ventas_historicas?.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Ventas históricas recientes:
          </Typography>
          <Stack spacing={0.5}>
            {resultado.ventas_historicas.slice(0, 3).map((v: any, i: number) => (
              <Typography key={i} variant="body2">
                {v.mes.slice(0, 7)}: S/ {Number(v.ventas).toLocaleString("es-PE")}
              </Typography>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}