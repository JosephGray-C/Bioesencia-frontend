// src/components/Carrito.jsx
import React, { useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const API_BASE = "http://localhost:8080/api/carrito";

async function fetchCarrito({ queryKey, signal }) {
    const [, userId] = queryKey;
    if (!userId) return [];
    const res = await fetch(`${API_BASE}/${userId}`, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).filter(
        (i) => i?.producto && typeof i.producto.precio !== "undefined"
    );
}

async function apiEliminarItem(itemId) {
    const res = await fetch(`${API_BASE}/eliminar/${itemId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

async function apiLimpiarCarrito(userId) {
    const res = await fetch(`${API_BASE}/limpiar/${userId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

export default function Carrito() {
    const { user } = useUser();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const {
        data: items = [],
        isFetching,
    } = useQuery({
        queryKey: ["carrito", user?.id],
        queryFn: fetchCarrito,
        enabled: !!user?.id,
        initialData: () => qc.getQueryData(["carrito", user?.id]) || [],
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    const showSpinner = isFetching && items.length === 0;

    const mEliminar = useMutation({
        mutationFn: apiEliminarItem,
        onMutate: async (itemId) => {
            await qc.cancelQueries({ queryKey: ["carrito", user?.id] });
            const prev = qc.getQueryData(["carrito", user?.id]) || [];
            qc.setQueryData(["carrito", user?.id], (old = []) =>
                old.filter((it) => it.id !== itemId)
            );
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) qc.setQueryData(["carrito", user?.id], ctx.prev);
            Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ["carrito", user?.id] });
        },
    });

    const mLimpiar = useMutation({
        mutationFn: apiLimpiarCarrito,
        onMutate: async (uid) => {
            await qc.cancelQueries({ queryKey: ["carrito", uid] });
            const prev = qc.getQueryData(["carrito", uid]) || [];
            qc.setQueryData(["carrito", uid], []);
            return { prev };
        },
        onError: (_err, uid, ctx) => {
            if (ctx?.prev) qc.setQueryData(["carrito", uid], ctx.prev);
            Swal.fire("Error", "No se pudo vaciar el carrito", "error");
        },
        onSettled: (_d, _e, uid) => {
            qc.invalidateQueries({ queryKey: ["carrito", uid] });
        },
    });

    const eliminarItem = async (itemId) => {
        mEliminar.mutate(itemId);
    };

    const limpiarCarrito = async () => {
        const confirm = await Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminarán todos los productos del carrito",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#c0392b",
            cancelButtonColor: "#6c757d",
        });
        if (!confirm.isConfirmed || !user?.id) return;
        mLimpiar.mutate(user.id, {
            onSuccess: () => {
                Swal.fire("Carrito vacío", "Se eliminaron todos los productos", "success");
            },
        });
    };

    const { subtotal, impuesto, total } = useMemo(() => {
        const sb = items.reduce(
            (acc, item) => acc + (Number(item.producto?.precio || 0) * Number(item.cantidad || 0)),
            0
        );
        const tax = sb * 0.13;
        return { subtotal: sb, impuesto: tax, total: sb + tax };
    }, [items]);

    if (!user) {
        return (
            <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
                <div
                    style={{
                        background: "#fff",
                        padding: 40,
                        borderRadius: 16,
                        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                        width: "100%",
                        maxWidth: 900,
                        textAlign: "center",
                    }}
                >
                    <h2 style={{ marginBottom: 12 }}>🛍️ Carrito de compras</h2>
                    <p>Debes iniciar sesión para ver tu carrito.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    background: "#fff",
                    padding: "40px",
                    borderRadius: 16,
                    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                    width: "100%",
                    maxWidth: "900px",
                }}
            >
                <h2 style={{ marginBottom: "24px" }}>🛍️ Carrito de compras</h2>

                {items.length === 0 ? (
                    <div
                        style={{
                            minHeight: 160,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {showSpinner ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                <ClipLoader size={22} color="#888" speedMultiplier={0.9} />
                                <span style={{ color: "#777" }}>Cargando carrito…</span>
                            </span>
                        ) : (
                            <p>No hay productos en el carrito.</p>
                        )}
                    </div>
                ) : (
                    <>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "20px",
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th style={{ padding: "12px", textAlign: "left" }}>Producto</th>
                                    <th style={{ textAlign: "center" }}>Cantidad</th>
                                    <th style={{ textAlign: "right" }}>Precio unitario</th>
                                    <th style={{ textAlign: "right" }}>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: "12px" }}>{item.producto?.nombre}</td>
                                        <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                                        <td style={{ textAlign: "right" }}>
                                            ₡{Number(item.producto?.precio || 0).toFixed(2)}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            ₡{Number(
                                                (item.producto?.precio || 0) * (item.cantidad || 0)
                                            ).toFixed(2)}
                                        </td>
                                        <td style={{ width: 120, textAlign: "right" }}>
                                            <button
                                                onClick={() => eliminarItem(item.id)}
                                                disabled={mEliminar.isPending}
                                                style={{
                                                    background: "#c0392b",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 6,
                                                    padding: "6px 12px",
                                                    cursor: mEliminar.isPending ? "not-allowed" : "pointer",
                                                    opacity: mEliminar.isPending ? 0.8 : 1,
                                                }}
                                                title={mEliminar.isPending ? "Eliminando…" : "Eliminar"}
                                            >
                                                {mEliminar.isPending ? "Eliminando…" : "Eliminar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                            }}
                        >
                            <button
                                onClick={limpiarCarrito}
                                disabled={mLimpiar.isPending}
                                style={{
                                    background: "#c0392b",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: mLimpiar.isPending ? "not-allowed" : "pointer",
                                    fontWeight: 600,
                                    opacity: mLimpiar.isPending ? 0.85 : 1,
                                }}
                                title={mLimpiar.isPending ? "Vaciando…" : "Vaciar carrito"}
                            >
                                🗑 {mLimpiar.isPending ? "Vaciando…" : "Vaciar carrito"}
                            </button>

                            <div style={{ textAlign: "right" }}>
                                <p>
                                    <strong>Subtotal:</strong> ₡{subtotal.toFixed(2)}
                                </p>
                                <p>
                                    <strong>Impuesto:</strong> ₡{impuesto.toFixed(2)}
                                </p>
                                <p>
                                    <strong>Total:</strong> ₡{total.toFixed(2)}
                                </p>
                                <button
                                    onClick={() => navigate("/resumen")}
                                    disabled={items.length === 0}
                                    style={{
                                        marginTop: "14px",
                                        background: items.length === 0 ? "#ccc" : "#5EA743",
                                        color: "#fff",
                                        padding: "12px 24px",
                                        border: "none",
                                        borderRadius: 8,
                                        cursor: items.length === 0 ? "not-allowed" : "pointer",
                                        fontSize: "1rem",
                                        opacity: items.length === 0 ? 0.7 : 1,
                                    }}
                                >
                                    Finalizar compra
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}