import axios from "axios";
const BASE_URL = "http://localhost:8000/inventory";

// Listar inventario (join con producto)
export async function getInventario() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

// Crear registro de inventario
export async function createInventario(data: { product_id: number; quantity: number }) {
  const res = await axios.post(BASE_URL, data);
  return res.data;
}

// Actualizar cantidad de inventario
export async function updateInventario(id: number, data: { quantity: number }) {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
}

// Eliminar registro de inventario
export async function deleteInventario(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}