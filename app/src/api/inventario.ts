import axios from "axios";
const BASE_URL = "http://localhost:8000/inventory";

export async function getInventario() {
  const res = await axios.get(BASE_URL);
  return res.data;
}