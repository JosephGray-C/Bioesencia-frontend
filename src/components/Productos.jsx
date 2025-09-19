import { useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchProductosActivos } from "../services/productos";
import ProductoModal from "./ProductoModal";
import Producto from "./Producto";


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
        <div className="productos-page">
            <header className="bu-hero">
                <div className="bu-hero-inner">
                    <p className="bu-hero-subtitle">
                        Descubre la variedad de productos naturales y
                        artesanales de <strong>Bioesencia</strong>.
                    </p>
                </div>
            </header>
            <div className="productos-view">
                <div className="productos-grid">
                    {productos.length === 0 ? (
                        <div
                            className="mensaje-vacio"
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
                                    <ClipLoader
                                        size={24}
                                        color="#A9C499"
                                        speedMultiplier={0.9}
                                    />
                                    <span style={{ color: "#5A0D0D" }}>
                                        Cargando productos…
                                    </span>
                                </span>
                            ) : (
                                "No hay productos disponibles."
                            )}
                        </div>
                    ) : (
                        productos.map(
                            (prod) =>
                                prod && (
                                   <Producto key={prod.id} prod={prod} setModalProd={setModalProd} />
                                )
                        )
                    )}
                </div>
                {modalProd && (
                    <ProductoModal
                        producto={modalProd}
                        userId={user?.id ?? null}
                        onClose={() => setModalProd(null)}
                    />
                )}
            </div>
        </div>
    );
}