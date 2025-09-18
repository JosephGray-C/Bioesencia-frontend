const API_ORDENES = "http://localhost:8080/api/ordenes";

export async function fetchOrdenes({ signal }) {
    const res = await fetch(API_ORDENES, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function postCrearOrden(data) {
    const res = await fetch(API_ORDENES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function actualizarEstadoOrden({ id, estado }) {
    const url = `${API_ORDENES}/${id}/estado?estado=${encodeURIComponent(
        estado
    )}`;
    const res = await fetch(url, { method: "PUT" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}
