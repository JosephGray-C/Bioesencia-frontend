const API_URL = "http://localhost:8080/api/talleres";

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