import { useIsAdmin } from "../utils/checkRole";

export default function BlogPost({ post, fillForm, isPreview }) {
    const esAdmin = useIsAdmin();

    const handleModificarPost = (post) => {
        if (fillForm) fillForm(post);
    };

    return (
        <article key={post.idPost} className="bu-card">
            {/* Imagen */}
            {post.imagen ? (
                <div className="bu-card-media">
                    <img
                        src={post.imagen}
                        alt={post.titulo || "Imagen del post"}
                        loading="lazy"
                    />
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
            <div
                className="bu-card-footer"
                style={{
                    justifyContent: "space-between",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <time className="bu-card-date">
                    {isPreview ? "" :new Date(post.fechaCreacion).toLocaleString("es-CR")}
                </time>

                {isPreview === true ? (
                    <></>
                ) : (
                    <div>
                        {esAdmin && (
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                    type="button"
                                    onClick={() => handleModificarPost(post)}
                                    className="bu-card-action-btn bu-card-edit"
                                    title="Modificar"
                                >
                                    Modificar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}