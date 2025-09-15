import { useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchProductosActivos } from "../services/productos";
import ProductoModal from "./ProductoModal";


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
            <header className="productos-hero">
                <div className="productos-hero-inner">
                    <p className="productos-subtitle">
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
                                    <article
                                        className="bu-card producto-card"
                                        key={prod.id}
                                        onClick={() => setModalProd(prod)}
                                        tabIndex={0}
                                    >
                                        {/* Imagen */}
                                        {prod.imagenUrl ? (
                                            <div className="bu-card-media">
                                                <img
                                                    src={prod.imagenUrl}
                                                    alt={prod.nombre}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display =
                                                            "none";
                                                        e.target.parentNode.classList.add(
                                                            "bu-card-media--placeholder"
                                                        );
                                                        e.target.parentNode.innerHTML =
                                                            "<span>Bioesencia</span>";
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="bu-card-media bu-card-media--placeholder">
                                                <span>Bioesencia</span>
                                            </div>
                                        )}
                                        {/* Contenido */}
                                        <div className="bu-card-body">
                                            <h3 className="bu-card-title">
                                                {prod.nombre}
                                            </h3>
                                            <p className="bu-card-excerpt">
                                                {prod.descripcion}
                                            </p>
                                        </div>
                                        {/* Footer */}
                                        <div className="bu-card-footer bu-card-footer--product">
                                            <span className="bu-card-price">
                                                {Number(
                                                    prod.precio || 0
                                                ).toLocaleString("es-CR", {
                                                    style: "currency",
                                                    currency: "CRC",
                                                    minimumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </article>
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