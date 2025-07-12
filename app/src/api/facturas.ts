import axios from "axios";

const BASE_URL = "http://localhost:8000/invoices";

// Obtener todas las facturas
export async function getFacturas() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

// Obtener una factura por ID
export async function getFactura(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

// Crear una factura nueva
export async function createFactura(factura: {
  client_id: number;
  products: { product_id: number; quantity: number }[];
  total: number;
  status?: string;
}) {
  const res = await axios.post(BASE_URL, factura);
  return res.data;
}

// Actualizar una factura existente
export async function updateFactura(id: number, factura: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, factura);
  return res.data;
}

// Eliminar una factura
export async function deleteFactura(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}