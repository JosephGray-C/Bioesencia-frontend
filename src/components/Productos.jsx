// src/components/Productos.jsx
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import "../assets/css/productos.css";

const API_URL = "http://localhost:8080/api/productos/activos";
const API_CARRITO = "http://localhost:8080/api/carrito/agregar";

async function fetchProductos({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error("No se pudo cargar productos");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function postAgregarCarrito({ userId, productoId, cantidad }) {
    const url = `${API_CARRITO}?usuarioId=${encodeURIComponent(
        userId
    )}&productoId=${encodeURIComponent(productoId)}&cantidad=${encodeURIComponent(
        cantidad
    )}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

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
                        ? { ...it, cantidad: Number(it.cantidad || 0) + Number(cant || 0) }
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
            Swal.fire("Error", err.message || "No se pudo agregar al carrito.", "error");
        },
        onSettled: (_ok, _err, vars) => {
            qc.invalidateQueries({ queryKey: ["carrito", vars.userId] });
        },
    });

    const handleAgregar = () => {
        if (!producto) return;
        if (!userId) {
            Swal.fire("Inicia sesión", "Debes iniciar sesión para agregar productos.", "info");
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
            producto: { id: producto.id, nombre: producto.nombre, precio: producto.precio },
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <img src={producto.imagenUrl || "/placeholder.jpg"} alt={producto.nombre} />
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
                                Math.max(1, Math.min(producto.stock, Number(e.target.value) || 1))
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
                    title={mAgregar.isPending ? "Agregando..." : "Agregar al carrito"}
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

    const {
        data: productos = [],
        isFetching,
    } = useQuery({
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
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                <ClipLoader size={24} color="#bbb" speedMultiplier={0.9} />
                                <span style={{ color: "#bbb" }}>Cargando productos…</span>
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
                                    <img src={prod.imagenUrl || "/placeholder.jpg"} alt={prod.nombre} />
                                    <div className="producto-nombre">{prod.nombre}</div>
                                    <div className="producto-precio">
                                        {Number(prod.precio || 0).toLocaleString("es-CR", {
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
    );
}