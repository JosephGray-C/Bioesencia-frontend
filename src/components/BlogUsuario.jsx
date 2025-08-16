// src/components/BlogUsuario.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/posts";

export default function BlogUsuario() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/listar`);
        const data = await res.json();
        const arr =
          Array.isArray(data) ? data :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data?.content) ? data.content :
          Array.isArray(data?.items) ? data.items :
          [];
        setPosts(arr);
      } catch (err) {
        console.error("Error al obtener posts:", err);
        setPosts([]); // evita que quede undefined/null
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;

  return (
    <div style={{ padding: "2rem", background: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        Blog de Bioesencia
      </h2>

      {!Array.isArray(posts) || posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay publicaciones disponibles.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.idPost ?? post.id ?? crypto.randomUUID()}
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", color: "#5EA743" }}>
              {post.titulo}
            </h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.contenido}</p>

            {post.imagen && (
              <img
                src={post.imagen}
                alt="imagen del post"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  marginTop: "1rem",
                  background: "#fff",
                  borderRadius: "8px"
                }}
              />
            )}

            {post.fechaCreacion && (
              <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#aaa" }}>
                Publicado el {new Date(post.fechaCreacion).toLocaleString("es-CR")}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
