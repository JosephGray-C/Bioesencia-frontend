const API_URL = process.env.REACT_APP_TALLERES_URL;

export async function fetchTalleres({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function fetchTaller({ queryKey, signal }) {
    const [, id] = queryKey;
    const res = await fetch(`${API_URL}/${id}`, { signal });
    if (res.status === 404) {
        const err = new Error("NOT_FOUND");
        err.code = 404;
        throw err;
    }
    if (!res.ok) throw new Error(res.text());
    return res.json();
}

export async function createTaller(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function deleteTaller(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function updateTaller(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res;
}
