import axios from "axios";

const BASE_URL = "http://localhost:8000/products";

export async function getProductos() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function getProducto(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

export async function createProducto(producto: {
  name: string;
  description?: string;
  price: number;
}) {
  const res = await axios.post(BASE_URL, producto);
  return res.data;
}

export async function updateProducto(id: number, producto: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, producto);
  return res.data;
}

export async function deleteProducto(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}


export async function getLowStockProductos(threshold = 5) {
  const res = await axios.get(`${BASE_URL}/low-stock?threshold=${threshold}`);
  return res.data;
}