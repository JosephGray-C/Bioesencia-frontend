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
            <style>{styles}</style>
        </article>
    );
}
const styles = 
`
    .bu-card-action-btn {
        background: #A9C499;
        color: #5A0D0D;
        border: none;
        padding: 8px 16px;
        border-radius: 7px;
        font-size: 0.98rem;
        font-weight: 700;
        cursor: pointer;
        transition: background .15s, transform .15s;
        min-width: 80px;
    }
    .bu-card-action-btn:hover {
        background: #8aa37c;
        transform: translateY(-1px);
    }
    .bu-card-edit {
        background: #e6f7e6;
        color: #388e3c;
    }
    .bu-card-edit:hover {
        background: #cdeed0;
    }
    .bu-card-delete {
        background: #fbeaea;
        color: #5A0D0D;
    }
    .bu-card-delete:hover {
        background: #f3d6d6;
    }
`;
