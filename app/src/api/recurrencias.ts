import axios from "axios";

const BASE_URL = "http://localhost:8000/recurrences";

export async function getRecurrencias() {
  return (await axios.get(BASE_URL)).data;
}

export async function getRecurrencia(id: number) {
  return (await axios.get(`${BASE_URL}/${id}`)).data;
}

export async function createRecurrencia(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

export async function updateRecurrencia(id: number, data: any) {
  return (await axios.put(`${BASE_URL}/${id}`, data)).data;
}

export async function deleteRecurrencia(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}