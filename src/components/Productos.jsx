import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchProductos } from "../services/productos";
import { postAgregarCarrito } from "../services/carrito";

function ProductoModal({ producto, userId, onClose }) {
    const [cantidad, setCantidad] = useState(1);
    const qc = useQueryClient();

    const mAgregar = useMutation({
        mutationFn: postAgregarCarrito,
        onMutate: async ({ userId: uid, cantidad: cant, producto: p }) => {
            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: `${p.nombre} fue agregado al carrito.`,
                timer: 1100,
                showConfirmButton: false,
            });
            const key = ["carrito", uid];
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key) || [];
            const existente = prev.find((it) => it?.producto?.id === p.id);
            const siguiente = existente
                ? prev.map((it) =>
                      it.producto.id === p.id
                          ? {
                                ...it,
                                cantidad:
                                    Number(it.cantidad || 0) +
                                    Number(cant || 0),
                            }
                          : it
                  )
                : [
                      ...prev,
                      {
                          id: `temp-${p.id}-${Date.now()}`,
                          cantidad: Number(cant || 1),
                          producto: {
                              id: p.id,
                              nombre: p.nombre,
                              precio: Number(p.precio || 0),
                          },
                      },
                  ];
            qc.setQueryData(key, siguiente);
            onClose?.();
            return { prev, key };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.prev && ctx?.key) qc.setQueryData(ctx.key, ctx.prev);
            Swal.fire(
                "Error",
                err.message || "No se pudo agregar al carrito.",
                "error"
            );
        },
        onSettled: (_ok, _err, vars) => {
            qc.invalidateQueries({ queryKey: ["carrito", vars.userId] });
        },
    });

    const handleAgregar = () => {
        if (!producto) return;
        if (!userId) {
            Swal.fire(
                "Inicia sesión",
                "Debes iniciar sesión para agregar productos.",
                "info"
            );
            return;
        }
        if (cantidad < 1) {
            Swal.fire("Atención", "La cantidad debe ser al menos 1.", "info");
            return;
        }
        mAgregar.mutate({
            userId,
            productoId: producto.id,
            cantidad,
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
            },
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <img
                    src={producto.imagenUrl || "/placeholder.jpg"}
                    alt={producto.nombre}
                />
                <div className="modal-title">{producto.nombre}</div>
                <div className="modal-description">{producto.descripcion}</div>
                <div className="modal-price">
                    {Number(producto.precio || 0).toLocaleString("es-CR", {
                        style: "currency",
                        currency: "CRC",
                        minimumFractionDigits: 2,
                    })}
                </div>
                <div className="modal-stock">Stock: {producto.stock}</div>
                <div className="modal-cantidad">
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={cantidad}
                        onChange={(e) =>
                            setCantidad(
                                Math.max(
                                    1,
                                    Math.min(
                                        producto.stock,
                                        Number(e.target.value) || 1
                                    )
                                )
                            )
                        }
                        min={1}
                        max={producto.stock}
                    />
                </div>
                <button
                    className="modal-agregar"
                    disabled={producto.stock < 1 || mAgregar.isPending}
                    onClick={handleAgregar}
                    title={
                        mAgregar.isPending
                            ? "Agregando..."
                            : "Agregar al carrito"
                    }
                >
                    {mAgregar.isPending ? "Agregando..." : "Agregar al carrito"}
                </button>
            </div>
        </div>
    );
}

export default function Productos() {
    const [modalProd, setModalProd] = useState(null);
    const { user } = useUser();
    const location = useLocation();

    const qc = useQueryClient();
    const { data: productos = [], isFetching } = useQuery({
        queryKey: ["productosActivos", location.pathname],
        queryFn: fetchProductos,
        initialData: () =>
            qc.getQueryData(["productosActivos", location.pathname]) || [],
        onError: () => {
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        },
    });

    const showSpinner = isFetching && productos.length === 0;

    return (
        <div className="productos-page">
            <style>{styles}</style>
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
                                    <div
                                        className="producto-card"
                                        key={prod.id}
                                        onClick={() => setModalProd(prod)}
                                        tabIndex={0}
                                    >
                                        <img
                                            src={
                                                prod.imagenUrl ||
                                                "/placeholder.jpg"
                                            }
                                            alt={prod.nombre}
                                        />
                                        <div className="producto-nombre">
                                            {prod.nombre}
                                        </div>
                                        <div className="producto-precio">
                                            {Number(
                                                prod.precio || 0
                                            ).toLocaleString("es-CR", {
                                                style: "currency",
                                                currency: "CRC",
                                                minimumFractionDigits: 2,
                                            })}
                                        </div>
                                    </div>
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

const styles = `
.productos-page {
    min-height: 100vh;
    background: #fff;
    padding: 24px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
@media (min-width:640px){.productos-page{padding:32px 20px;}}
@media (min-width:1024px){.productos-page{padding:40px 24px;}}

.productos-hero {
    width: 100%;
    max-width: 900px;
    margin: 0 auto 18px auto;
    text-align: left;
    padding: 18px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.productos-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
}
.productos-title {
    margin: 0 0 8px 0;
    color: #5A0D0D;
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: .2px;
}
.productos-subtitle {
    margin: 0;
    color: #41503a;
    font-size: clamp(14px, 2vw, 17px);
    line-height: 1.7;
    margin-top: 10px;
    margin-bottom: 18px;
    padding-top: 6px;
    padding-bottom: 6px;
    display: block;
}

.productos-view {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.productos-grid {
    list-style: none;
    margin: 0 auto;
    padding: 0;
    display: grid;
    gap: 22px;
    max-width: 900px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    justify-items: center;
    align-items: stretch;
}
@media (min-width: 1100px){
    .productos-grid{
        max-width: 1100px;
        gap: 28px;
    }
}

.producto-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 8px 22px rgba(0,0,0,.07);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
    max-width: 340px;
    width: 100%;
    transition: transform .16s, box-shadow .16s;
    cursor: pointer;
    align-items: center;
}
.producto-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(0,0,0,.10);
}
.producto-card img {
    width: 100%;
    max-width: 320px;
    height: 180px;
    object-fit: cover;
    border-radius: 16px 16px 0 0;
    background: #f6f7f9;
}
.producto-nombre {
    margin: 12px 0 4px 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #5A0D0D;
    text-align: left;
    width: 90%;
}
.producto-precio {
    margin-bottom: 12px;
    font-size: 1.08rem;
    font-weight: 600;
    color: #41503a;
    width: 90%;
    text-align: left;
}

.mensaje-vacio {
    color: #6b7280;
    font-size: 1.08rem;
    font-weight: 600;
    letter-spacing: .5px;
}

.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(60,60,60,0.18);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal-content {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(0,0,0,.13);
    padding: 28px 22px 22px 22px;
    min-width: 320px;
    max-width: 98vw;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.modal-close {
    position: absolute;
    top: 12px;
    right: 18px;
    background: none;
    border: none;
    font-size: 2rem;
    color: #5A0D0D;
    cursor: pointer;
}
.modal-content img {
    width: 100%;
    max-width: 320px;
    height: 180px;
    object-fit: cover;
    border-radius: 14px;
    margin-bottom: 12px;
    background: #f6f7f9;
}
.modal-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #5A0D0D;
    margin-bottom: 8px;
    text-align: center;
}
.modal-description {
    font-size: 1rem;
    color: #23272f;
    margin-bottom: 10px;
    text-align: center;
}
.modal-price {
    font-size: 1.08rem;
    font-weight: 700;
    color: #41503a;
    margin-bottom: 8px;
}
.modal-stock {
    font-size: .98rem;
    color: #6b7280;
    margin-bottom: 8px;
}
.modal-cantidad {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}
.modal-cantidad label {
    font-size: 1rem;
    color: #23272f;
}
.modal-cantidad input {
    width: 60px;
    padding: 4px 8px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #f6f7f9;
    text-align: center;
}
.modal-agregar {
    background: #A9C499;
    color: #5A0D0D;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background .15s, transform .15s;
    margin-top: 8px;
    min-width: 120px;
}
.modal-agregar:disabled {
    background: #d1e3d1;
    color: #aaa;
    cursor: not-allowed;
}
.modal-agregar:hover:not(:disabled) {
    background: #8aa37c;
    transform: translateY(-1px);
}
@media (max-width:700px){
    .modal-content {
        min-width: 0;
        padding: 18px 6px 16px 6px;
    }
    .modal-content img {
        height: 140px;
    }
}
`;
