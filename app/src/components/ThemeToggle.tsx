import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

export default function ThemeToggle() {
  const mode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();
  return (
    <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
      {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}