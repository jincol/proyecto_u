import React, { useEffect, useState } from "react";
import { fetchPrediccionMLCliente } from "../../api/mlResults";
import PrediccionMLCard from "../dashboard/PrediccionMLCard";

export default function ClienteDetalle({ clientId }: { clientId: number }) {
  const [prediccion, setPrediccion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPrediccionMLCliente(clientId)
      .then((data) => setPrediccion(data))
      .finally(() => setLoading(false));
  }, [clientId]);

  return (
    <div>
      {/* ... otros datos del cliente ... */}
      <h2>Predicción automática ML</h2>
      {loading ? (
        <p>Cargando predicción...</p>
      ) : prediccion ? (
        <PrediccionMLCard resultado={prediccion} />
      ) : (
        <p>No hay predicción disponible para este cliente.</p>
      )}
    </div>
  );
}