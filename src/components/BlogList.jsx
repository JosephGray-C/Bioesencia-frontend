import BlogPost from "./BlogPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerPosts } from "../services/post";
import Loading from "./Loading";

export default function BlogList({ fillForm }) {
    const qc = useQueryClient();

    const { data: posts = [], isFetching } = useQuery({
        queryKey: ["posts"],
        queryFn: obtenerPosts,
        initialData: () => qc.getQueryData(["posts"]) || [],
    });

    const showSpinner = isFetching && posts.length === 0;

    const postsOrdenados = [...posts].sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );

    return (
        <>
            {posts.length === 0 ? (
                <div
                    className="empty"
                    style={{
                        gridColumn: "1 / -1",
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {showSpinner ? (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <Loading message="Cargando publicaciones" />
                        </span>
                    ) : (
                        "No hay publicaciones disponibles."
                    )}
                </div>
            ) : (
                <ul className="list-grid">
                    {postsOrdenados.map((post) => (
                        <BlogPost
                            key={post.idPost}
                            post={post}
                            fillForm={fillForm}
                            isPreview={false}
                        ></BlogPost>
                    ))}
                </ul>
            )}
        </>
    );
}
