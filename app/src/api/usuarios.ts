import axios from "axios";

const BASE_URL = "http://localhost:8000/users";

export async function getUsuarios() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function getUsuario(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

export async function createUsuario(usuario: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) {
  const res = await axios.post(BASE_URL, usuario);
  return res.data;
}

export async function updateUsuario(id: number, usuario: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, usuario);
  return res.data;
}

export async function deleteUsuario(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}