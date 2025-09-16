const API_CARRITO = "http://localhost:8080/api/carrito";

export async function fetchCarrito({ queryKey, signal }) {
    const userId = queryKey[1];
    console.log(userId)
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
    console.log(itemId)
    const res = await fetch(`${API_CARRITO}/eliminar/${itemId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

