import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditarPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ titulo: "", contenido: "", imagen: "" });

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "No se pudo obtener el post.",
          icon: "error",
          confirmButtonColor: "#5A0D0D"
        });
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/api/posts/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!res.ok) throw new Error("Error al actualizar el post");

      await Swal.fire({
        title: "Post actualizado",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        confirmButtonColor: "#5EA743"
      });

      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el post.",
        icon: "error",
        confirmButtonColor: "#5A0D0D"
      });
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "2rem auto", color: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "1rem" }}>Editar post</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Título"
          value={post.titulo}
          onChange={(e) => setPost({ ...post, titulo: e.target.value })}
          required
          style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Contenido"
          value={post.contenido}
          onChange={(e) => setPost({ ...post, contenido: e.target.value })}
          required
          style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #ccc", minHeight: 100 }}
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={post.imagen || ""}
          onChange={(e) => setPost({ ...post, imagen: e.target.value })}
          style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            style={{
              minWidth: "140px",
              background: "#5EA743",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Guardar
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            style={{
              minWidth: "140px",
              background: "#6c757d",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}
