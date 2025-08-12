// src/components/ResumenCompra.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_CARRITO = "http://localhost:8080/api/carrito";
const API_ORDENES = "http://localhost:8080/api/ordenes";

export default function ResumenCompra() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const cargarCarrito = async () => {
            try {
                const res = await fetch(`${API_CARRITO}/${user.id}`);
                const data = await res.json();
                // Validar que cada item tenga producto válido
                const filtrados = (data || []).filter(item => item.producto && typeof item.producto.precio !== "undefined");
                setCarrito(filtrados);
            } catch (err) {
                console.error("Error cargando carrito", err);
            }
        };

        if (user) cargarCarrito();
    }, [user]);

    const calcularTotales = () => {
        let subtotal = 0;
        carrito.forEach(item => {
            subtotal += item.producto.precio * item.cantidad;
        });
        const impuesto = subtotal * 0.13;
        const total = subtotal + impuesto;
        return { subtotal, impuesto, total };
    };

    const confirmarOrden = async () => {
        try {
            if (!user) throw new Error("Usuario no autenticado");

            const orden = {
                usuario: { id: user.id },
                items: carrito.map(item => ({
                    producto: { id: item.producto.id },
                    cantidad: item.cantidad
                }))
            };

            const res = await fetch(API_ORDENES, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orden)
            });

            if (!res.ok) throw new Error("No se pudo registrar la orden");

            const ordenGuardada = await res.json();

            Swal.fire({
                title: "Orden generada",
                text: "Te hemos enviado el PDF de tu orden de compra",
                icon: "success",
                confirmButtonText: "Finalizar",
                confirmButtonColor: "#5EA743"
            }).then(() => {
                navigate(`/orden/${ordenGuardada.codigoOrden}`);
            });

        } catch (err) {
            console.error("Error al confirmar orden:", err);
            Swal.fire("Error", err.message, "error");
        }
    };

    const { subtotal, impuesto, total } = calcularTotales();

    return (
        <div style={{ background: "#23272f", padding: "40px 0", minHeight: "100vh" }}>
            <div style={{
                background: "#fff",
                width: "90%",
                maxWidth: "920px",
                margin: "0 auto",
                padding: "50px 60px",
                fontFamily: "Arial, sans-serif",
                fontSize: 15,
                boxShadow: "0 0 10px rgba(0,0,0,0.15)"
            }}>
                {/* Logo y datos empresa */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <img
                            src="/imgs/LOGO_BIOESENCIA.jpg"
                            alt="Logo"
                            style={{ height: 80, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 18, fontWeight: "bold", color: "#5EA743" }}>
                            BIOESENCIA
                        </div>
                    </div>
                    <div style={{ fontSize: 14, textAlign: "right" }}>
                        <div><strong>Cédula:</strong> 1-1058-0435</div>
                        <div><strong>Teléfono:</strong> +506 8362-1394</div>
                        <div><strong>Correo:</strong> bioesenciacostarica@gmail.com</div>
                        <div><strong>Código Postal:</strong> 10601</div>
                    </div>
                </div>

                {/* Cliente */}
                <div style={{
                    backgroundColor: "#ccc", padding: "6px 10px",
                    fontWeight: "bold", marginTop: 30, marginBottom: 10
                }}>
                    Datos del Cliente
                </div>
                <table style={{ width: "100%", marginBottom: 20 }}>
                    <tbody>
                    <tr>
                        <td><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</td>
                        <td><strong>Email:</strong> {user?.email}</td>
                    </tr>
                    </tbody>
                </table>

                {/* Tabla productos */}
                <div style={{
                    backgroundColor: "#ccc", padding: "6px 10px",
                    fontWeight: "bold", marginBottom: 10
                }}>
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
                    {carrito.map(item => (
                        <tr key={item.id}>
                            <td style={{ padding: 10 }}>{item.producto.nombre}</td>
                            <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                            <td style={{ textAlign: "center" }}>₡{item.producto.precio.toFixed(2)}</td>
                            <td style={{ textAlign: "center" }}>
                                ₡{(item.producto.precio * item.cantidad).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Totales */}
                <table style={{ width: "100%", fontSize: 15 }}>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: "right", paddingRight: 12 }}><strong>Subtotal:</strong></td>
                        <td style={{ textAlign: "right" }}>₡{subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "right", paddingRight: 12 }}><strong>Impuestos:</strong></td>
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
                            background: "#888", color: "#fff", padding: "10px 24px",
                            border: "none", borderRadius: 8, cursor: "pointer"
                        }}
                    >
                        Volver al carrito
                    </button>

                    <button
                        onClick={confirmarOrden}
                        style={{
                            background: "#5EA743", color: "#fff", padding: "10px 28px",
                            border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600
                        }}
                    >
                        Confirmar Orden
                    </button>
                </div>
            </div>
        </div>
    );
}
