const API_URL = process.env.REACT_APP_SERVICIOS_URL;
console.log('SERVICIOS API_URL:', API_URL);

export async function fetchServicios({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function crearServicio(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function eliminarServicio(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function actualizarServicio({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

