import axios from "axios";

const BASE_URL = "http://localhost:8000/segments";

export async function getSegmentos() {
  return (await axios.get(BASE_URL)).data;
}

export async function createSegmento(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

export async function deleteSegmento(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}