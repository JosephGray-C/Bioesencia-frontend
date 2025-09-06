const API_URL = "http://localhost:8080/api/productos";

export async function fetchProductos({ signal }) {
    const res = await fetch(`${API_URL}/activos`, { signal });
    if (!res.ok) throw new Error("No se pudo cargar productos");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function crearProducto(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function eliminarProducto(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function actualizarProducto({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}
