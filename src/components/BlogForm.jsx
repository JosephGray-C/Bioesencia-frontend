import Swal from "sweetalert2";
import { eliminarPost, actualizarPost, crearPost } from "../services/post";
import { useQueryClient } from "@tanstack/react-query";

export default function BlogForm({ preview, setPreview, originalPost }) {
    const qc = useQueryClient();

    const isUnchanged =
        originalPost &&
        preview.titulo === originalPost.titulo &&
        preview.contenido === originalPost.contenido &&
        preview.imagen === originalPost.imagen;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreview((prev) => ({ ...prev, [name]: value }));
    };

    const handlePublicarPost = async (post) => {
        if (!post.titulo || !post.contenido) {
            return Swal.fire(
                "",
                "Por favor, completa todos los campos.",
                "info"
            );
        }
        const res = await crearPost(post);
        if (!res.ok) {
            Swal.fire("Error", "No se pudo crear el post.", "error");
            console.log(res);
        } else {
            Swal.fire("Éxito", "El post fue creado.", "success");
            qc.invalidateQueries({ queryKey: ["blogPosts"] }); // <-- Refetch posts
            handleLimpiarForm();
        }
    };

    const handleEditarPost = async (post) => {
        if (!post.titulo || !post.contenido || !post.imagen) {
            return Swal.fire(
                "",
                "Por favor, completa todos los campos.",
                "info"
            );
        }
        if (isUnchanged) {
            return Swal.fire("", "No se han realizado cambios.", "info");
        }
        const res = await actualizarPost(post.idPost, post);
        if (!res.ok) {
            console.log(res);
            Swal.fire("", "No se pudo editar el post.", "error");
        } else {
            Swal.fire("Éxito", "El post fue editado.", "success");
            qc.invalidateQueries({ queryKey: ["blogPosts"] }); // <-- Refetch posts
            handleLimpiarForm();
        }
    };

    const handleEliminarPost = async (idPost) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar post?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#5A0D0D",
            cancelButtonColor: "#6c757d",
        });

        if (confirm.isConfirmed) {
            const res = await eliminarPost(idPost);
            if (!res.ok) {
                Swal.fire("Error", "No se pudo eliminar el post.", "error");
            } else {
                Swal.fire("Eliminado", "El post fue eliminado.", "success");
                qc.invalidateQueries({ queryKey: ["blogPosts"] }); // <-- Refetch posts
                handleLimpiarForm();
            }
        }
    };

    const handleLimpiarForm = () => {
        setPreview({
            idPost: null,
            titulo: "",
            contenido: "",
            imagen: "",
        });
    };

    return (
        <form className="blog-form">
            <style>{styles}</style>
            <div className="blog-form-fields">
                <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={preview.titulo || ""}
                    onChange={handleChange}
                    required
                    className="blog-form-input"
                />
                <textarea
                    name="contenido"
                    placeholder="Contenido"
                    value={preview.contenido || ""}
                    onChange={handleChange}
                    className="blog-form-textarea"
                />
                <input
                    type="text"
                    name="imagen"
                    placeholder="URL de imagen (opcional)"
                    value={preview.imagen || ""}
                    onChange={handleChange}
                    className="blog-form-input"
                />
            </div>
            <div className="blog-form-actions">
                {preview?.idPost ? (
                    <>
                        <button
                            type="button"
                            onClick={() => handleEditarPost(preview)}
                            className="bu-card-action-btn bu-card-edit"
                            title="Editar"
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            onClick={() => handleEliminarPost(preview.idPost)}
                            className="bu-card-action-btn bu-card-delete"
                            title="Eliminar"
                        >
                            Eliminar
                        </button>
                        <button
                            type="button"
                            onClick={() => handleLimpiarForm()}
                            className="bu-card-action-btn bu-card-clear"
                            title="Limpiar"
                        >
                            Limpiar
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="bu-card-action-btn bu-card-submit"
                        title="Publicar"
                        onClick={() => handlePublicarPost(preview)}
                    >
                        Publicar
                    </button>
                )}
            </div>
        </form>
    );
}

const styles = `
.blog-form {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 4px 16px rgba(0,0,0,.07);
    padding: 0;
    max-width: 400px;
    min-height: 402px;
    width: 100%;
    justify-content: center;
    margin: 0;
    overflow: hidden;
}
.blog-form-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 20px 10px 20px;
}
.blog-form-input,
.blog-form-textarea {
    font-size: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    width: 100%;
    background: #f6f7f8;
    color: #23272f;
    font-family: inherit;
    resize: none;
    box-sizing: border-box;
}
.blog-form-input:focus,
.blog-form-textarea:focus {
    outline: 2px solid #A9C499;
    border-color: #A9C499;
}
.blog-form-textarea {
    min-height: 90px;
    max-height: 220px;
}
.blog-form-actions {
    padding: 10px 20px 16px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid #f3f4f6;
    background: #fff;
}
.bu-card-action-btn {
    background: #A9C499;
    color: #5A0D0D;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-weight: 800;
    font-size: 1rem;
    cursor: pointer;
    transition: background .15s, transform .15s;
    min-width: 80px;
}
.bu-card-action-btn:disabled {
    opacity: .7;
    cursor: not-allowed;
}
.bu-card-action-btn:hover:not(:disabled) {
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
.bu-card-clear {
    background: #f6f7f8;
    color: #23272f;
}
.bu-card-clear:hover {
    background: #e5e7eb;
}
.bu-card-submit {
    background: #A9C499;
    color: #5A0D0D;
}
@media (max-width: 700px) {
    .blog-form {
        max-width: 98vw;
        min-width: 0;
    }
    .blog-form-fields,
    .blog-form-actions {
        padding-left: 8px;
        padding-right: 8px;
    }
}
`;
