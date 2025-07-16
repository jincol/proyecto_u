import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#43a047", "#1976d2", "#ffa000"];
const SEGMENT_LABELS = ["Premium", "Recurrente", "En riesgo"];

export default function ClientesPorSegmentoChart({ data }) {
  // data: [{ segmento_ml: "Premium", cantidad: 8 }, ...]
  return (
    <PieChart width={260} height={220}>
      <Pie
        data={data}
        dataKey="cantidad"
        nameKey="segmento_ml"
        cx="50%"
        cy="50%"
        outerRadius={70}
        label={({ segmento_ml }) => segmento_ml}
      >
        {data.map((entry, index) => (
          <Cell key={entry.segmento_ml} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}