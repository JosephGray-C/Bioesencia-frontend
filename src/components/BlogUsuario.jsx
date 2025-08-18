<<<<<<< HEAD
// src/components/BlogUsuario.jsx
import React, { useEffect, useState } from "react";
=======
import React, { useEffect, useState, useMemo } from "react";
>>>>>>> 075d139 (FrontEnd completo responsive)
import { useUser } from "../context/UserContext";

const API_URL = "http://localhost:8080/api/posts";

export default function BlogUsuario() {
<<<<<<< HEAD
    const { user } = useUser();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/listar`)
            .then(res => res.json())
            .then(data => setPosts(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error al obtener posts:", err));
    }, []);

    const guestContainerStyle = !user
        ? { width: "100%", maxWidth: 900, margin: "0 auto" }
        : {};

    return (
        <div style={{ padding: "2rem", color: "#fff" }}>
            <div style={guestContainerStyle}>
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
                                background: "#A9C499",
                                padding: "1.5rem",
                                borderRadius: "12px",
                                marginBottom: "1.5rem",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem", color: "#5A0D0D" }}>
                                {post.titulo}
                            </h3>
                            <p style={{ whiteSpace: "pre-wrap", color: "#000000" }}>{post.contenido}</p>
                            {post.imagen && (
                                <img
                                    src={post.imagen}
                                    alt="imagen del post"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        maxWidth: 600,
                                        marginTop: "1rem",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        borderRadius: "8px"
                                    }}
                                />
                            )}
                            <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#000000" }}>
                                Publicado el {new Date(post.fechaCreacion).toLocaleString("es-CR")}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
=======
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/listar`)
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al obtener posts:", err));
  }, []);

  // Contenedor centrado (desktop) — ligeramente más angosto
  const containerStyle = useMemo(
    () => ({ width: "100%", maxWidth: 980, margin: "0 auto" }),
    []
  );

  return (
    <div className="bu-page">
      <style>{styles}</style>

      {/* Título simple (sin fondo) */}
      <header className="bu-hero">
        <div className="bu-hero-inner" style={containerStyle}>
          <h1 className="bu-hero-title">Blog</h1>
          <p className="bu-hero-subtitle">
            Novedades, consejos y contenido de bienestar de <strong>Bioesencia</strong>.
          </p>
        </div>
      </header>

      {/* Contenido */}
      <main className="bu-main" style={containerStyle}>
        {posts.length === 0 ? (
          <div className="bu-empty">No hay publicaciones disponibles.</div>
        ) : (
          <section className="bu-grid">
            {posts.map((post) => (
              <article key={post.idPost} className="bu-card">
                {/* Imagen */}
                {post.imagen ? (
                  <div className="bu-card-media">
                    <img src={post.imagen} alt={post.titulo || "Imagen del post"} loading="lazy" />
                  </div>
                ) : (
                  <div className="bu-card-media bu-card-media--placeholder">
                    <span>Bioesencia</span>
                  </div>
                )}

                {/* Contenido */}
                <div className="bu-card-body">
                  <h3 className="bu-card-title">{post.titulo}</h3>
                  <p className="bu-card-excerpt">{post.contenido}</p>
                </div>

                {/* Footer */}
                <div className="bu-card-footer">
                  <time className="bu-card-date">
                    {new Date(post.fechaCreacion).toLocaleString("es-CR")}
                  </time>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

/* ====== ESTILOS ====== */
const styles = `
:root{
  --biosencia-black:#23272f;
  --biosencia-wine:#5A0D0D;
  --biosencia-green:#A9C499;
  --blackTransparent: rgba(0,0,0,.65);
}

/* Página base */
.bu-page{
  background:#fff;
  min-height: 100vh;
  display:flex;
  flex-direction:column;
}

/* HERO sin fondo, compacto */
.bu-hero{
margin-top:3dvh;
  background: transparent;       /* <- sin color de fondo */
  padding: 18px 16px 10px;       /* menos alto */
}
.bu-hero-inner{ display:flex; flex-direction:column; gap:4px; }

/* Título más pequeño y angosto (solo ocupa su contenido) */
.bu-hero-title{
  margin: 0;
  display: inline-block;         /* <- hace el ancho ajustado al texto */
  color: var(--biosencia-wine);
  font-size: clamp(22px, 3vw, 28px);  /* <- más pequeño */
  font-weight: 800;
  letter-spacing: .2px;
  line-height: 1.1;
}
.bu-hero-subtitle{
  margin: 0;
  color: #41503a;
  font-size: clamp(13px, 1.9vw, 15px);
}

/* MAIN */
.bu-main{
  padding: 16px 16px 48px;       /* un poco más compacto */
}

/* GRID de tarjetas */
.bu-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(14px, 2vw, 22px);
}

/* Tarjeta */
.bu-card{
  background:#fff;
  border:1px solid rgba(0,0,0,.08);
  border-radius:16px;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  transition: transform .18s ease, box-shadow .18s ease;
}
.bu-card:hover{
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,.09);
}

/* Media */
.bu-card-media{
  width:100%;
  aspect-ratio: 16/9;
  background:#f6f7f8;
  display:grid;
  place-items:center;
}
.bu-card-media img{
  width:100%;
  height:100%;
  object-fit:cover;
}
.bu-card-media--placeholder span{
  color:#8aa37c;
  font-weight:700;
  letter-spacing:.5px;
}

/* Body */
.bu-card-body{
  padding: 14px 16px 8px;
}
.bu-card-title{
  margin: 0 0 6px;
  font-size: clamp(18px, 2.2vw, 20px);
  color: var(--biosencia-wine);
  font-weight: 800;
}
.bu-card-excerpt{
  margin: 0;
  color: var(--blackTransparent);
  font-size: 14.5px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.bu-card-footer{
  padding: 10px 16px 14px;
  display:flex;
  justify-content:flex-end;
}
.bu-card-date{
  color:#6b7280;
  font-size: 12.5px;
}

/* Vacio */
.bu-empty{
  width:100%;
  max-width: 800px;
  margin: 12px auto 0;
  background:#f7f7f7;
  border:1px dashed rgba(0,0,0,.15);
  border-radius:12px;
  padding: 18px;
  text-align:center;
  color:#666;
}

/* Responsive fino */
@media (max-width: 520px){
  .bu-hero{ padding: 14px 14px 8px; }
  .bu-main{ padding: 12px 14px 36px; }
  .bu-card-body{ padding: 12px 14px 6px; }
  .bu-card-footer{ padding: 8px 14px 12px; }
}
`;
>>>>>>> 075d139 (FrontEnd completo responsive)
