import axios from "axios";
const BASE_URL = "http://localhost:8000/ml-results";

export async function getMLResultados() {
  return (await axios.get(BASE_URL)).data;
}
export async function createMLResultado(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}
export async function deleteMLResultado(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}