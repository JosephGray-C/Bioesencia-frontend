import { useState } from "react";
import { useIsAdmin } from "../utils/checkRole";
import BlogForm from "./BlogForm";
import BlogPost from "./BlogPost";
import BlogList from "./BlogList";

export default function Blog() {
    const esAdmin = useIsAdmin();
    
    const [preview, setPreview] = useState({
        idPost: null,
        titulo: "",
        contenido: "",
        imagen: "",
        fechaCreacion: new Date().toISOString(),
    });

    const [originalPost, setOriginalPost] = useState(null);

    const fillForm = (post) => {
        setPreview({
            titulo: post.titulo || "",
            contenido: post.contenido || "",
            imagen: post.imagen || "",
            fechaCreacion: post.fechaCreacion || new Date().toISOString(),
            idPost: post.idPost,
        });
        setOriginalPost(post);
    };

    return (
        <div className="bu-page">
            <header className="bu-hero">
                <div
                    className="bu-hero-inner"
                    style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}
                >
                    {esAdmin ? (
                        <p className="bu-hero-subtitle">
                            Administra las publicaciones del blog de{" "}
                            <strong>Bioesencia</strong>.
                        </p>
                    ) : (
                        <p className="bu-hero-subtitle">
                            Novedades, consejos y contenido de bienestar de{" "}
                            <strong>Bioesencia</strong>.
                        </p>
                    )}
                </div>
            </header>

            {esAdmin && (
                <section className="blog-admin-preview">
                  
                    <BlogForm preview={preview} setPreview={setPreview} originalPost={originalPost} />
                    <BlogPost post={preview} isPreview={true} />
                </section>
            )}

            <section>
                <BlogList fillForm={fillForm} />
            </section>
        </div>
    );
}