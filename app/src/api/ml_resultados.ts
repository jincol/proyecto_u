import axios from "axios";
const BASE_URL = "http://localhost:8000/ml-results";

/**
 * Obtiene la lista de resultados de ML.
 */
export async function getMLResultados() {
  return (await axios.get(BASE_URL)).data;
}

/**
 * Crea un nuevo resultado de ML.
 * @param data Datos del resultado a crear.
 */
export async function createMLResultado(data: any) {
  return (await axios.post(BASE_URL, data)).data;
}

/**
 * Elimina un resultado de ML por su ID.
 * @param id ID del resultado a eliminar.
 */
export async function deleteMLResultado(id: number) {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
}

/**
 * Obtiene la predicción de ML de un cliente específico.
 * @param clientId ID del cliente.
 */
export async function fetchPrediccionMLCliente(clientId: number) {
  const resp = await axios.get(
    `http://localhost:8000/ml-results/prediccion-ventas?entity_id=${clientId}`
  );
  // Si tu API devuelve {result: ...}, saca el .result, si no, ajusta:
  return resp.data.result || resp.data;
}

/**
 * Obtiene la lista de clientes con segmento ML incluido (para dashboard, KPIs, etc).
 */
export async function fetchClientesConSegmento() {
  const resp = await axios.get("http://localhost:8000/clients/clientes");
  return Array.isArray(resp.data) ? resp.data : [];
}