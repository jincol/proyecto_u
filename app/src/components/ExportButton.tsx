import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useState } from "react";

const options = [
  { label: "Exportar a PDF", format: "pdf" },
  { label: "Exportar a Excel", format: "excel" },
  { label: "Exportar a CSV", format: "csv" },
  { label: "Exportar a XML", format: "xml" },
];

export default function ExportButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleExport = (format: string) => {
    setAnchorEl(null);
    // TODO: Implementar la exportación real
    alert(`Exportando a ${format.toUpperCase()}...`);
  };

  return (
    <>
      <Tooltip title="Exportar datos">
        <IconButton onClick={e => setAnchorEl(e.currentTarget)} color="primary">
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {options.map(opt => (
          <MenuItem key={opt.format} onClick={() => handleExport(opt.format)}>
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}