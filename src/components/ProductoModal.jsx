
import Swal from "sweetalert2";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAgregarCarrito } from "../services/carrito";

export default function ProductoModal({ producto, userId, onClose }) {
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
                          id: prev.id,
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
                {/* Mejor estilo para la imagen */}
                {producto.imagenUrl ? (
                    <div className="modal-media">
                        <img
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentNode.classList.add(
                                    "modal-media--placeholder"
                                );
                                e.target.parentNode.innerHTML =
                                    "<span>Bioesencia</span>";
                            }}
                        />
                    </div>
                ) : (
                    <div className="modal-media modal-media--placeholder">
                        <span>Bioesencia</span>
                    </div>
                )}
                <div className="modal-main">
                    <h2 className="modal-title">{producto.nombre}</h2>
                    <p className="modal-description">{producto.descripcion}</p>
                    <div className="modal-info">
                        <span className="modal-price">
                            {Number(producto.precio || 0).toLocaleString(
                                "es-CR",
                                {
                                    style: "currency",
                                    currency: "CRC",
                                    minimumFractionDigits: 2,
                                }
                            )}
                        </span>
                        <span className="modal-stock">
                            Stock: {producto.stock}
                        </span>
                    </div>
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
                        {mAgregar.isPending
                            ? "Agregando..."
                            : "Agregar al carrito"}
                    </button>
                </div>
            </div>
        </div>
    );
}