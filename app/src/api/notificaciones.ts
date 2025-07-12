import axios from "axios";

const BASE_URL = "http://localhost:8000/notifications";

export async function getNotificaciones() {
  return (await axios.get(BASE_URL)).data;
}

export async function getNotificacion(id: number) {
  return (await axios.get(`${BASE_URL}/${id}`)).data;
}

export async function createNotificacion(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

export async function updateNotificacion(id: number, data: any) {
  return (await axios.put(`${BASE_URL}/${id}`, data)).data;
}

export async function deleteNotificacion(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}