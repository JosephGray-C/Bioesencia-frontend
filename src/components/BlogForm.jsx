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
            qc.invalidateQueries({ queryKey: ["posts"] }); // <-- Refetch posts
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
            qc.invalidateQueries({ queryKey: ["posts"] }); // <-- Refetch posts
            Swal.fire("Éxito", "El post fue editado.", "success");
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
                qc.invalidateQueries({ queryKey: ["posts"] }); // <-- Refetch posts
                Swal.fire("Eliminado", "El post fue eliminado.", "success");
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