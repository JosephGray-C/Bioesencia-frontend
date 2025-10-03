import { useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductosActivos } from "../services/productos";
import ProductoModal from "./ProductoModal";
import Producto from "./Producto";
import Loading from "./Loading";

export default function Productos() {
    const [modalProd, setModalProd] = useState(null);
    const location = useLocation();
    const { user } = useUser();

    const qc = useQueryClient();
    const { data: productos = [], isFetching } = useQuery({
        queryKey: ["productosActivos", location.pathname],
        queryFn: fetchProductosActivos,
        initialData: () =>
            qc.getQueryData(["productosActivos", location.pathname]) || [],
        onError: () => {
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        },
    });

    const showSpinner = isFetching && productos.length === 0;

    return (
        <div className="list-page">

            <header className="bu-hero">
                <div className="bu-hero-inner">
                    <p className="bu-hero-subtitle">
                        Descubre la variedad de productos naturales y
                        artesanales de <strong>Bioesencia</strong>.
                    </p>
                </div>
            </header>
            
            <section>
                {productos.length === 0 ? (
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
                                    gap: 10,
                                }}
                            >
                                <Loading message="Cargando productos" />
                            </span>
                        ) : (
                            "No hay productos disponibles."
                        )}
                    </div>
                ) : (
                    <ul className="list-grid">
                        {productos.map(
                            (prod) =>
                                prod && (
                                    <Producto
                                        key={prod.id}
                                        prod={prod}
                                        setModalProd={setModalProd}
                                    />
                                )
                        )}
                    </ul>
                )}
            </section>

            {modalProd && (
                <ProductoModal
                    producto={modalProd}
                    userId={user?.id ?? null}
                    onClose={() => setModalProd(null)}
                />
            )}
        </div>
    );
}
