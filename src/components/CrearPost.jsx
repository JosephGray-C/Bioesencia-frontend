// src/components/CrearPost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CrearPost() {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [imagen, setImagen] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoPost = { titulo, contenido, imagen };

        try {
            const res = await fetch("http://localhost:8080/api/posts/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoPost),
            });

            if (!res.ok) throw new Error("Error al crear el post");

            await Swal.fire({
                title: "Post creado",
                text: "El post fue publicado correctamente.",
                icon: "success",
                confirmButtonColor: "#5EA743"
            });

            navigate("/admin/blog");
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "No se pudo crear el post.",
                icon: "error",
                confirmButtonColor: "#5A0D0D"
            });
        }
    };

    return (
    <div style={{ width: "100%", maxWidth: 600, margin: "2rem auto", color: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "1rem" }}>Crear nuevo post</h2>


      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL de imagen (opcional)"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        {/* Botones lado a lado dentro del formulario */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            style={{
              background: "#5EA743",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Publicar
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            style={{
              background: "#6c757d",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
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
