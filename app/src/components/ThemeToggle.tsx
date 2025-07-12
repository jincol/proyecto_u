import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDispatch, useSelector } from "react-redux";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state: any) => state.theme.mode);

  return (
    <Tooltip title={mode === "dark" ? "Modo claro" : "Modo oscuro"}>
      <IconButton onClick={() => dispatch({ type: "theme/toggle" })} color="inherit" sx={{ mx: 1 }}>
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}