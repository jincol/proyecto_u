import axios from "axios";

const BASE_URL = "http://localhost:8000/payments";

export async function getPagos() {
  return (await axios.get(BASE_URL)).data;
}

export async function createPago(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

export async function updatePago(id: number, data: any) {
  return (await axios.put(`${BASE_URL}/${id}`, data)).data;
}

export async function deletePago(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}