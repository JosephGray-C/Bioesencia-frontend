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
            <style>{styles}</style>

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

const styles = `
:root {
  --biosencia-black: #23272f;
  --biosencia-wine: #5A0D0D;
  --biosencia-green: #A9C499;
  --blackTransparent: rgba(0,0,0,.65);
}

.bu-page {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
}

.blog-admin-preview {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 900px;
  min-height: 300px; /* <-- Always reserve space for form + preview */
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
}
.blog-admin-preview > * {
  flex: 1 1 0;
  min-width: 280px; /* <-- Prevent shrinking too much */
  max-width: 400px;
}
@media (max-width: 900px) {
  .blog-admin-preview {
    gap: 18px;
    max-width: 98vw;
    min-height: 320px;
  }
  .blog-admin-preview > * {
    max-width: 100%;
    min-width: 220px;
  }
}
@media (max-width: 700px) {
  .blog-admin-preview {
    flex-direction: column;
    gap: 18px;
    align-items: stretch;
    margin-bottom: 1.2rem;
    max-width: 100vw;
    min-height: 0;
  }
  .blog-admin-preview > * {
    max-width: 100%;
    min-width: 0;
  }
}

.bu-hero {
  margin-top: 3vh;
  background: transparent;
  padding: 18px 16px 10px;
}
.bu-hero-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bu-hero-subtitle {
  margin: 0;
  color: #41503a;
  font-size: clamp(13px, 1.9vw, 15px);
}

.bu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  align-items: stretch;
}
@media (min-width: 900px) {
  .bu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.bu-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(0,0,0,.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .16s, box-shadow .16s;
  height: 100%;
  min-width: 380px;
}
.bu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(0,0,0,.10);
}
.bu-card-media {
  width: 100%;
  height: 220px;
  background: #f6f7f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.bu-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.bu-card-media--placeholder {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bu-card-body {
  padding: 18px 20px 10px 20px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bu-card-title {
  margin: 0 0 6px;
  color: var(--biosencia-wine);
  font-size: clamp(18px, 2vw, 20px);
  font-weight: 800;
}
.bu-card-excerpt {
  margin: 0;
  color: var(--blackTransparent);
  font-size: 15px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.bu-card-footer {
  padding: 10px 20px 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #f3f4f6;
}
.bu-card-date {
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 520px) {
  .bu-hero { padding: 14px 14px 8px; }
  .bu-card-body { padding: 12px 10px 6px 10px; }
  .bu-card-footer { padding: 8px 10px 12px 10px; }
  .bu-card-media, .bu-card-media--placeholder { height: 140px; }
}
`;
