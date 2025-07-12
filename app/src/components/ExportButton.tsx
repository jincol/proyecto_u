import { Button } from "@mui/material";
import { exportCSV } from "../utils/exportCSV";

export default function ExportButton({ data, filename }: { data: any[]; filename: string }) {
  return (
    <Button variant="outlined" onClick={() => exportCSV(data, filename)}>
      Exportar CSV
    </Button>
  );
}