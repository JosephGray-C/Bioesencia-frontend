const API_URL = process.env.REACT_APP_CITAS_URL;

export async function fetchCitas({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return Array.isArray(data) ? data : [];
}

export async function crearCita(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function eliminarCita(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function actualizarCita({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function horariosDisponibles(fecha) {
    const res = await fetch(`${API_URL}/horariosDisponibles?fecha=${fecha}`);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function citasAgendadas(date, uid) {
    const res = await fetch(`${API_URL}/agendadas/${date}/${uid}`, { method: "GET" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}