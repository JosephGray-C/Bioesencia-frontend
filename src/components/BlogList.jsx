import BlogPost from "./BlogPost";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerPosts } from "../services/post";

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
                <div className="bu-empty">
                    {showSpinner ? (
                        <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                        >
                            <ClipLoader
                                size={22}
                                color="#A9C499"
                                speedMultiplier={0.9}
                                />
                            <span style={{ color: "#5A0D0D" }}>
                                Cargando publicaciones…
                            </span>
                        </span>
                    ) : (
                        "No hay publicaciones disponibles."
                    )}
                </div>
            ) : (
                <section className="bu-grid">
                    {postsOrdenados.map((post) => (
                        <BlogPost
                        key={post.idPost}
                        post={post}
                        fillForm={fillForm}
                        isPreview={false}
                        ></BlogPost>
                    ))}
                </section>
            )}
        </> 
    );
}
