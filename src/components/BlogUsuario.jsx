// src/components/BlogUsuario.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const API_URL = "http://localhost:8080/api/posts";

export default function BlogUsuario() {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/listar`)
            .then(res => res.json())
            .then(data => setPosts(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error al obtener posts:", err));
    }, []);

    // Cuando NO hay sesión, acotamos el ancho y centramos
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
        </div>
    );
}