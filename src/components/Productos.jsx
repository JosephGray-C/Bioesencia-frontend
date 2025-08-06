// src/components/Productos.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import "../assets/css/productos.css";

const API_URL = "http://localhost:8080/api/productos/activos";
const API_CARRITO = "http://localhost:8080/api/carrito/agregar";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [modal, setModal] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const { user } = useUser();
    const location = useLocation();

    const cargarProductos = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("No se pudo cargar productos");
            const data = await res.json();
            setProductos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando productos", err);
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
        }
    };

    useEffect(() => {
        cargarProductos();
    }, [location.pathname]);

    const handleAgregarCarrito = async () => {
        if (!modal || cantidad < 1 || !user) return;

        try {
            const res = await fetch(`${API_CARRITO}?usuarioId=${user.id}&productoId=${modal.id}&cantidad=${cantidad}`, {
                method: "POST"
            });

            if (!res.ok) throw new Error("Error al agregar al carrito");

            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: `${modal.nombre} fue agregado al carrito.`,
                timer: 1500,
                showConfirmButton: false
            });

            setModal(null);
            setCantidad(1);
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="productos-view">
            <div className="productos-grid">
                {productos.length === 0 ? (
                    <div className="mensaje-vacio">No hay productos disponibles.</div>
                ) : (
                    productos.map(prod => (
                        prod && (
                            <div
                                className="producto-card"
                                key={prod.id}
                                onClick={() => {
                                    setModal(prod);
                                    setCantidad(1);
                                }}
                                tabIndex={0}
                            >
                                <img src={prod.imagenUrl || "/placeholder.jpg"} alt={prod.nombre} />
                                <div className="producto-nombre">{prod.nombre}</div>
                                <div className="producto-precio">
                                    {Number(prod.precio).toLocaleString("es-CR", {
                                        style: "currency",
                                        currency: "CRC",
                                        minimumFractionDigits: 2
                                    })}
                                </div>
                            </div>
                        )
                    ))
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setModal(null)}>×</button>
                        <img src={modal.imagenUrl || "/placeholder.jpg"} alt={modal.nombre} />
                        <div className="modal-title">{modal.nombre}</div>
                        <div className="modal-description">{modal.descripcion}</div>
                        <div className="modal-price">
                            {Number(modal.precio).toLocaleString("es-CR", {
                                style: "currency",
                                currency: "CRC",
                                minimumFractionDigits: 2
                            })}
                        </div>
                        <div className="modal-stock">Stock: {modal.stock}</div>
                        <div className="modal-cantidad">
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) =>
                                    setCantidad(Math.max(1, Math.min(modal.stock, Number(e.target.value) || 1)))
                                }
                                min={1}
                                max={modal.stock}
                            />
                        </div>
                        <button
                            className="modal-agregar"
                            disabled={modal.stock < 1}
                            onClick={handleAgregarCarrito}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
