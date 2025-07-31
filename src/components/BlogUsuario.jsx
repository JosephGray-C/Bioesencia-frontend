// src/components/BlogUsuario.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/posts";

export default function BlogUsuario() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/listar`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error al obtener posts:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        Blog de Bioesencia
      </h2>

      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay publicaciones disponibles.</p>
      ) : (
        posts.map(post => (
          <div
            key={post.idPost}
            style={{
              background: "#2f343f",
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
                  borderRadius: "8px"
                }}
              />
            )}

            <p
              style={{
                fontSize: "0.9rem",
                marginTop: "1rem",
                color: "#aaa"
              }}
            >
              Publicado el{" "}
              {new Date(post.fechaCreacion).toLocaleString("es-CR")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
