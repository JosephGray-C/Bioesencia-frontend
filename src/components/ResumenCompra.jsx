// src/components/ResumenCompra.jsx
import React, { useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_CARRITO = "http://localhost:8080/api/carrito";
const API_ORDENES = "http://localhost:8080/api/ordenes";

async function fetchCarrito({ queryKey, signal }) {
    const [, userId] = queryKey;
    if (!userId) return [];
    const res = await fetch(`${API_CARRITO}/${userId}`, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).filter(
        (item) => item?.producto && typeof item.producto.precio !== "undefined"
    );
}

async function postCrearOrden(payload) {
    const res = await fetch(API_ORDENES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export default function ResumenCompra() {
    const { user } = useUser();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data: carrito = [] } = useQuery({
        queryKey: ["carrito", user?.id],
        queryFn: fetchCarrito,
        enabled: !!user?.id,
        initialData: () => qc.getQueryData(["carrito", user?.id]) || [],
        staleTime: 120_000,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    const { subtotal, impuesto, total } = useMemo(() => {
        const sb = carrito.reduce(
            (acc, item) =>
                acc + Number(item.producto?.precio || 0) * Number(item.cantidad || 0),
            0
        );
        const tax = sb * 0.13;
        return { subtotal: sb, impuesto: tax, total: sb + tax };
    }, [carrito]);

    const mOrden = useMutation({
        mutationFn: postCrearOrden,
        onSuccess: (ordenGuardada) => {
            if (user?.id) qc.setQueryData(["carrito", user.id], []);

            Swal.fire({
                title: "Orden generada",
                text: "Te hemos enviado el PDF de tu orden de compra",
                icon: "success",
                confirmButtonText: "Finalizar",
                confirmButtonColor: "#5EA743",
            }).then(() => {
                navigate(`/orden/${ordenGuardada.codigoOrden}`);
            });
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "No se pudo registrar la orden", "error");
        },
    });

    const confirmarOrden = () => {
        if (!user) {
            Swal.fire("Error", "Usuario no autenticado", "error");
            return;
        }
        if (carrito.length === 0) {
            Swal.fire("Atención", "Tu carrito está vacío.", "info");
            return;
        }
        const payload = {
            usuario: { id: user.id },
            items: carrito.map((item) => ({
                producto: { id: item.producto.id },
                cantidad: item.cantidad,
            })),
        };
        mOrden.mutate(payload);
    };

    if (!user) {
        return (
            <div style={{ background: "#23272f", padding: "40px 0", minHeight: "100vh" }}>
                <div
                    style={{
                        background: "#fff",
                        width: "90%",
                        maxWidth: "920px",
                        margin: "0 auto",
                        padding: "50px 60px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                        textAlign: "center",
                    }}
                >
                    <h3>Debes iniciar sesión para continuar</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#23272f", padding: "40px 0", minHeight: "100vh" }}>
            <div
                style={{
                    background: "#fff",
                    width: "90%",
                    maxWidth: "920px",
                    margin: "0 auto",
                    padding: "50px 60px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: 15,
                    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                }}
            >
                {/* Logo y datos empresa */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <img
                            src="/imgs/LOGO_BIOESENCIA.jpg"
                            alt="Logo"
                            style={{ height: 80, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 18, fontWeight: "bold", color: "#5EA743" }}>BIOESENCIA</div>
                    </div>
                    <div style={{ fontSize: 14, textAlign: "right" }}>
                        <div>
                            <strong>Cédula:</strong> 1-1058-0435
                        </div>
                        <div>
                            <strong>Teléfono:</strong> +506 8362-1394
                        </div>
                        <div>
                            <strong>Correo:</strong> bioesenciacostarica@gmail.com
                        </div>
                        <div>
                            <strong>Código Postal:</strong> 10601
                        </div>
                    </div>
                </div>

                {/* Cliente */}
                <div
                    style={{
                        backgroundColor: "#ccc",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        marginTop: 30,
                        marginBottom: 10,
                    }}
                >
                    Datos del Cliente
                </div>
                <table style={{ width: "100%", marginBottom: 20 }}>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
                            </td>
                            <td>
                                <strong>Email:</strong> {user?.email}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Productos */}
                <div
                    style={{
                        backgroundColor: "#ccc",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        marginBottom: 10,
                    }}
                >
                    Productos
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                    <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                            <th style={{ padding: 10, textAlign: "left" }}>Producto</th>
                            <th style={{ padding: 10 }}>Cantidad</th>
                            <th style={{ padding: 10 }}>Precio unitario</th>
                            <th style={{ padding: 10 }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((item) => (
                            <tr key={item.id}>
                                <td style={{ padding: 10 }}>{item.producto.nombre}</td>
                                <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                                <td style={{ textAlign: "center" }}>
                                    ₡{Number(item.producto.precio || 0).toFixed(2)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    ₡{Number((item.producto.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {carrito.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 10, textAlign: "center", color: "#777" }}>
                                    No hay productos en el carrito.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Totales */}
                <table style={{ width: "100%", fontSize: 15 }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12 }}>
                                <strong>Subtotal:</strong>
                            </td>
                            <td style={{ textAlign: "right" }}>₡{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12 }}>
                                <strong>Impuestos:</strong>
                            </td>
                            <td style={{ textAlign: "right" }}>₡{impuesto.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12, fontSize: 16, fontWeight: 700 }}>
                                Total a pagar:
                            </td>
                            <td style={{ textAlign: "right", fontSize: 16, fontWeight: 700 }}>
                                ₡{total.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Botones */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                    <button
                        onClick={() => navigate("/carrito")}
                        style={{
                            background: "#888",
                            color: "#fff",
                            padding: "10px 24px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Volver al carrito
                    </button>

                    <button
                        onClick={confirmarOrden}
                        disabled={carrito.length === 0 || mOrden.isPending}
                        style={{
                            background:
                                carrito.length === 0 || mOrden.isPending ? "#a8d29a" : "#5EA743",
                            color: "#fff",
                            padding: "10px 28px",
                            border: "none",
                            borderRadius: 8,
                            cursor:
                                carrito.length === 0 || mOrden.isPending ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            opacity: carrito.length === 0 || mOrden.isPending ? 0.9 : 1,
                        }}
                        title={mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
                    >
                        {mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
                    </button>
                </div>
            </div>
        </div>
    );
}