const API_URL = process.env.REACT_APP_PRODUCTOS_URL;

export async function fetchProductos({ signal }) {
    console.log(API_URL);
    console.log("asdfasdfasdfasdafasd")
    const res = await fetch(`${API_URL}`, { signal });
    if (!res.ok) throw new Error("No se pudo cargar productos");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function fetchProductosActivos({ signal }) {
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
