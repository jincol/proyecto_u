import axios from "axios";

const BASE_URL = "http://localhost:8000/products";

// Obtener todos los productos
export async function getProductos() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

// Obtener un producto por ID
export async function getProducto(id: number) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

// Crear un producto nuevo
export async function createProducto(producto: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}) {
  const res = await axios.post(BASE_URL, producto);
  return res.data;
}

// Actualizar un producto existente
export async function updateProducto(id: number, producto: any) {
  const res = await axios.put(`${BASE_URL}/${id}`, producto);
  return res.data;
}

// Eliminar un producto
export async function deleteProducto(id: number) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}