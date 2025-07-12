import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // Cambia la URL a la de tu backend real
  //     const res = await axios.post("http://localhost:8000/auth/login", { email, password });
  //     localStorage.setItem("token", res.data.access_token);
  //     setError("");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError("Usuario o contraseña incorrectos");
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  // Simulación: acepta cualquier usuario durante desarrollo
  localStorage.setItem("token", "fake-token");
  setError("");
  navigate("/dashboard");
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}