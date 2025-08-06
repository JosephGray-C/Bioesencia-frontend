// src/components/Carrito.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:8080/api/carrito";

export default function Carrito() {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;

        const cargarCarrito = async () => {
            try {
                const res = await fetch(`${API_BASE}/${user.id}`);
                const data = await res.json();
                const filtrados = (data || []).filter(i => i.producto && typeof i.producto.precio !== "undefined");
                setItems(filtrados);
            } catch (err) {
                console.error("Error cargando carrito", err);
            }
        };

        cargarCarrito();
    }, [user, location.pathname]);

    const eliminarItem = async (itemId) => {
        await fetch(`${API_BASE}/eliminar/${itemId}`, { method: "DELETE" });
        setItems(prev => prev.filter(item => item.id !== itemId));
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

        if (!confirm.isConfirmed) return;

        try {
            await fetch(`${API_BASE}/limpiar/${user.id}`, { method: "DELETE" });
            setItems([]);
            Swal.fire("Carrito vacío", "Se eliminaron todos los productos", "success");
        } catch (err) {
            Swal.fire("Error", "No se pudo vaciar el carrito", "error");
        }
    };

    const subtotal = items.reduce(
        (acc, item) => acc + (item.producto?.precio || 0) * item.cantidad, 0
    );
    const impuesto = subtotal * 0.13;
    const total = subtotal + impuesto;

    return (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
                background: "#fff",
                padding: "40px",
                borderRadius: 16,
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: "900px"
            }}>
                <h2 style={{ marginBottom: "24px" }}>🛍️ Carrito de compras</h2>

                {items.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                            <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                                <th style={{ padding: "12px" }}>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ padding: "12px" }}>{item.producto?.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>₡{Number(item.producto?.precio || 0).toFixed(2)}</td>
                                    <td>₡{Number((item.producto?.precio || 0) * item.cantidad).toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => eliminarItem(item.id)}
                                            style={{
                                                background: "#c0392b",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "6px 12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <button
                                onClick={limpiarCarrito}
                                style={{
                                    background: "#c0392b",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontWeight: 600
                                }}
                            >
                                🗑 Vaciar carrito
                            </button>

                            <div style={{ textAlign: "right" }}>
                                <p><strong>Subtotal:</strong> ₡{subtotal.toFixed(2)}</p>
                                <p><strong>Impuesto:</strong> ₡{impuesto.toFixed(2)}</p>
                                <p><strong>Total:</strong> ₡{total.toFixed(2)}</p>
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
                                        opacity: items.length === 0 ? 0.7 : 1
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
