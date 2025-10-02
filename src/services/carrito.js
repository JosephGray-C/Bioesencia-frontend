const API_CARRITO = process.env.REACT_APP_CARRITO_URL;

export async function fetchCarrito({ queryKey, signal }) {
    console.log(API_CARRITO)
    const userId = queryKey[1];
    if (!userId) return [];
    const res = await fetch(`${API_CARRITO}/${userId}`, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data)
    return Array.isArray(data) ? data : [];
}

export async function postAgregarCarrito({ userId, productoId, cantidad }) {
    const url = `${API_CARRITO}/agregar?usuarioId=${encodeURIComponent(
        userId
    )}&productoId=${encodeURIComponent(
        productoId
    )}&cantidad=${encodeURIComponent(cantidad)}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function apiEliminarItem(itemId) {
    const res = await fetch(`${API_CARRITO}/eliminar/${itemId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}