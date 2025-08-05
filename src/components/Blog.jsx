import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/posts";

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch(`${API_URL}/listar`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error al obtener posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const eliminarPost = async (idPost) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar post?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#5A0D0D",
      cancelButtonColor: "#6c757d"
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/eliminar/${idPost}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Error al eliminar el post");
        Swal.fire("Eliminado", "El post fue eliminado.", "success");
        fetchPosts(); // Recargar lista
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el post.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2 style={{
        textAlign: "center",
        fontSize: "2rem",
        marginBottom: "1rem"
      }}>
        Gestión de Blog
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => navigate("/admin/blog/crear")}
          style={{
            padding: "14px 28px",
            background: "#5EA743",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          Crear nuevo post
        </button>
      </div>

      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay posts aún.</p>
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
            <h3 style={{ marginBottom: "0.5rem", color: "#5EA743" }}>{post.titulo}</h3>
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

            <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#aaa" }}>
              Publicado el {new Date(post.fechaCreacion).toLocaleString("es-CR")}
            </p>

            <div style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1.5rem"
            }}>
              <button
                onClick={() => navigate(`/admin/blog/editar/${post.idPost}`)}
                style={{
                  width: "100px",
                  background: "#007BFF",
                  color: "#fff",
                  border: "none",
                  padding: "10px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Editar
              </button>

              <button
                onClick={() => eliminarPost(post.idPost)}
                style={{
                  width: "100px",
                  background: "#5A0D0D",
                  color: "#fff",
                  border: "none",
                  padding: "10px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
