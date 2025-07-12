import axios from "axios";

const BASE_URL = "http://localhost:8000/users";

// Obtener todos los usuarios
export async function getUsuarios() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

// Obtener un usuario por ID
export async function getUsuario(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

// Crear un usuario nuevo
export async function createUsuario(usuario: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) {
  const res = await axios.post(BASE_URL, usuario);
  return res.data;
}

// Actualizar un usuario existente (ajusta según tu backend)
export async function updateUsuario(id: number, usuario: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, usuario);
  return res.data;
}

// Eliminar un usuario
export async function deleteUsuario(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}