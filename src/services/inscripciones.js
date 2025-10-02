const API_URL = process.env.REACT_APP_INSCRIPCIONES_URL;

export async function fetchInscripciones({ signal }) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error("No se pudo cargar la lista de inscripciones.");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchInscripcionTaller({ queryKey, signal }) {
  const [, id] = queryKey;
  const res = await fetch(`${API_URL}/taller/${id}`, { signal });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function crearInscripcion(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

export async function eliminarInscripcion(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

export async function inscripcionesAgendadas(date, uid) {
  const res = await fetch(`${API_URL}/agendadas/${date}/${uid}`, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

