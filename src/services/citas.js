const API_URL = "http://localhost:8080/api/citas";

export async function fetchCitas({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
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
