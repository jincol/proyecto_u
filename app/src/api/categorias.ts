import axios from "axios";

const BASE_URL = "http://localhost:8000/categories";

export async function getCategorias() {
  return (await axios.get(BASE_URL)).data;
}

export async function createCategoria(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

export async function deleteCategoria(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}