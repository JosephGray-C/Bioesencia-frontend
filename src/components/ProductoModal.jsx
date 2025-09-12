
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
            <style>{modalStyles}</style>
        </div>
    );
}

const modalStyles = `
.modal-content {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(0,0,0,.18);
    padding: 0;
    width: 480px;
    min-width: 320px;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: modalIn .22s cubic-bezier(.6,.2,.4,1);
}
@keyframes modalIn {
    from { opacity: 0; transform: translateY(30px) scale(.97);}
    to { opacity: 1; transform: translateY(0) scale(1);}
}
.modal-media, .modal-main {
    width: 100%;
    max-width: 440px;
    box-sizing: border-box;
}
.modal-media {
    height: 180px;
    background: #f6f7f9;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
}
.modal-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 24px 24px 0 0;
}
.modal-media--placeholder {
    font-size: 1.15rem;
    color: #5A0D0D;
    font-weight: 700;
    background: #f6f7f9;
    letter-spacing: 1px;
}
.modal-main {
    padding: 28px 28px 18px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.modal-title {
    font-size: 1.45rem;
    font-weight: 800;
    color: #5A0D0D;
    margin-bottom: 8px;
    text-align: center;
}
.modal-description {
    font-size: 1.08rem;
    color: #23272f;
    margin-bottom: 10px;
    text-align: center;
}
.modal-info {
    display: flex;
    gap: 18px;
    font-size: 1.12rem;
    color: #41503a;
    margin-bottom: 8px;
    justify-content: center;
}
.modal-price {
    font-weight: 700;
    color: #41503a;
    font-size: 1.18rem;
}
.modal-stock {
    font-size: 1rem;
    color: #6b7280;
}
.modal-cantidad {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}
.modal-cantidad label {
    font-size: 1.08rem;
    color: #23272f;
}
.modal-cantidad input {
    width: 60px;
    padding: 4px 8px;
    font-size: 1.08rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #f6f7f9;
    text-align: center;
}
.modal-agregar {
    background: #A9C499;
    color: #5A0D0D;
    border: none;
    border-radius: 10px;
    padding: 14px 28px;
    font-weight: 700;
    font-size: 1.15rem;
    cursor: pointer;
    transition: background .15s, transform .15s;
    margin-top: 12px;
    min-width: 160px;
    box-shadow: 0 2px 8px rgba(0,0,0,.07);
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
.modal-close {
    position: absolute;
    top: 18px;
    right: 28px;
    background: none;
    border: none;
    font-size: 2.2rem;
    color: #5A0D0D;
    cursor: pointer;
    z-index: 2;
    transition: color .15s;
}
.modal-close:hover {
    color: #A9C499;
}
@media (max-width:700px){
    .modal-content {
        border-radius: 14px;
        max-width: 99vw;
        width: 99vw;
    }
    .modal-media, .modal-main {
        max-width: 99vw;
        padding-left: 8px;
        padding-right: 8px;
    }
    .modal-media {
        height: 140px;
    }
}
@media (max-width:480px){
    .modal-content {
        max-width: 100vw;
        width: 100vw;
        border-radius: 8px;
    }
    .modal-media, .modal-main {
        max-width: 100vw;
        padding-left: 2vw;
        padding-right: 2vw;
    }
    .modal-media {
        height: 100px;
    }
}
`;