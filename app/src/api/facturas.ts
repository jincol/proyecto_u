import axios from "axios";
const BASE_URL = "http://localhost:8000/invoices";

export async function getFacturas() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function getFactura(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}


export async function createFactura(factura: {
  folio: string;
  client_id: number;
  products: { product_id: number; quantity: number }[];
  total: number;
  date: string;
  status?: string;
  notes?: string;
}) {
  const res = await axios.post(BASE_URL, factura);
  return res.data;
}

export async function updateFactura(id: number, factura: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, factura);
  return res.data;
}

export async function deleteFactura(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}