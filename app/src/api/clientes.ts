import axios from "axios";

const BASE_URL = "http://localhost:8000/clients";

export async function getClientes() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function getCliente(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

export async function createCliente(cliente: {
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
}) {
  const res = await axios.post(BASE_URL, cliente);
  return res.data;
}

export async function updateCliente(id: number, cliente: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, cliente);
  return res.data;
}

export async function deleteCliente(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}