import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/api/posts";

export default function Blog() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: posts = [], isFetching } = useQuery({
    queryKey: ["blogPostsAdmin"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/listar`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    initialData: () => qc.getQueryData(["blogPostsAdmin"]) || [],
  });

  const showSpinner = isFetching && posts.length === 0;

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
        // Puedes llamar a refetch si quieres actualizar la lista
        // refetch();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el post.", "error");
      }
    }
  };

  return (
    <div className="bu-page">
      <style>{styles}</style>
      <header className="bu-hero">
        <div className="bu-hero-inner" style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}>
          <p className="bu-hero-subtitle">
            Administra las publicaciones del blog de <strong>Bioesencia</strong>.
          </p>
        </div>
      </header>

      <main className="bu-main" style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}>
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
          <div className="bu-empty">
            {showSpinner ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ClipLoader size={22} color="#A9C499" speedMultiplier={0.9} />
                <span style={{ color: "#5A0D0D" }}>Cargando publicaciones…</span>
              </span>
            ) : (
              "No hay publicaciones disponibles."
            )}
          </div>
        ) : (
          <section className="bu-grid">
            {posts.map(post => (
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
                <div className="bu-card-footer" style={{ justifyContent: "space-between" }}>
                  <time className="bu-card-date">
                    {new Date(post.fechaCreacion).toLocaleString("es-CR")}
                  </time>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => navigate(`/admin/blog/editar/${post.idPost}`)}
                      style={{
                        background: "#007BFF",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.95rem"
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarPost(post.idPost)}
                      style={{
                        background: "#5A0D0D",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.95rem"
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

const styles = `
:root{
  --biosencia-black:#23272f;
  --biosencia-wine:#5A0D0D;
  --biosencia-green:#A9C499;
  --blackTransparent: rgba(0,0,0,.65);
}
.bu-page{
  background:#fff;
  min-height: 100vh;
  display:flex;
  flex-direction:column;
}
.bu-hero{
  margin-top:3dvh;
  background: transparent;
  padding: 18px 16px 10px;
}
.bu-hero-inner{ display:flex; flex-direction:column; gap:4px; }
.bu-hero-title{
  margin: 0;
  display: inline-block;
  color: var(--biosencia-wine);
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
  letter-spacing: .2px;
  line-height: 1.1;
}
.bu-hero-subtitle{
  margin: 0;
  color: #41503a;
  font-size: clamp(13px, 1.9vw, 15px);
}
.bu-main{
  padding: 16px 16px 48px;
}
.bu-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(14px, 2vw, 22px);
}

/* Solo 2 columnas en pantallas grandes */
@media (min-width: 900px){
  .bu-grid{
    grid-template-columns: repeat(2, 1fr);
  }
}
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
.bu-card-footer{
  padding: 10px 16px 14px;
  display:flex;
  justify-content:flex-end;
  align-items: center;
  gap: 1rem;
}
.bu-card-date{
  color:#6b7280;
  font-size: 12.5px;
}
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
@media (max-width: 520px){
  .bu-hero{ padding: 14px 14px 8px; }
  .bu-main{ padding: 12px 14px 36px; }
  .bu-card-body{ padding: 12px 14px 6px; }
  .bu-card-footer{ padding: 8px 14px 12px; }
}
`;