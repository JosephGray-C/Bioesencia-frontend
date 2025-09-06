const API_URL = "http://localhost:8080/api/posts";

export async function obtenerPosts({ signal }) {
    const res = await fetch(`${API_URL}/listar`, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}  

export async function obtenerPostPorId(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function crearPost(data) {
    const res = await fetch(`${API_URL}/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function eliminarPost(id) {
    const res = await fetch(`${API_URL}/eliminar/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function actualizarPost(id, data) {
    const res = await fetch(`${API_URL}/actualizar/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

