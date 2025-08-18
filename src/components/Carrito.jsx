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
    return Array.isArray(data) ? data : [];
}

async function apiEliminarItem(itemId) {
    const res = await fetch(`${API_BASE}/eliminar/${itemId}`, { method: "DELETE" });
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
        refetchOnMount: "always",
    });

    const showSpinner = isFetching && items.length === 0;

    const mEliminar = useMutation({
        mutationFn: apiEliminarItem,
        onMutate: async (itemId) => {
            await qc.cancelQueries({ queryKey: ["carrito", user?.id] });
            const prev = qc.getQueryData(["carrito", user?.id]) || [];
            qc.setQueryData(["carrito", user?.id], (old = []) => old.filter((it) => it.id !== itemId));
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

    const eliminarItem = (itemId) => mEliminar.mutate(itemId);

    const { total } = useMemo(() => {
        const sb = items.reduce((acc, item) => {
            const precio = Number(item?.producto?.precio ?? 0);
            const cantidad = Number(item?.cantidad ?? 0);
            return acc + precio * cantidad;
        }, 0);
        const tax = sb * 0.13;
        return { subtotal: sb, impuesto: tax, total: sb + tax };
    }, [items]);

    if (!user) {
        return (
            <div className="cart__outer">
                <style>{styles}</style>
                <section className="cart__section">
                    <div className="cart__titlebar">
                        <h1 className="cart__title">Tu carrito</h1>
                        <button className="cart__link" onClick={() => navigate("/productos")}>
                            <u>Seguir comprando</u>
                        </button>
                    </div>
                    <div className="cart__card">
                        <div className="cart__empty">Debes iniciar sesión para ver tu carrito.</div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="cart__outer">
            <style>{styles}</style>

            <main className="main--cart-page">
                <section className="main__cart-product-table-section-container">
                    <div className="main__cart-title-container">
                        <h1 className="main__cart-title">Tu carrito</h1>
                        <button className="main__cart-continue-buying-link" onClick={() => navigate("/productos")}>
                            <u>Seguir comprando</u>
                        </button>
                    </div>

                    <div className="cart__card">
                        <div className="main__cart-product-table-columns-defines">
                            <span className="main__cart-product-table-column">PRODUCTO</span>
                            <span className="main__cart-product-table-column">TOTAL</span>
                        </div>

                        <div className="main__cart-product-table-items-container">
                            {items.length === 0 ? (
                                <div className="main__cart-empty-cart">
                                    {showSpinner ? (
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <ClipLoader size={22} color="#888" speedMultiplier={0.9} />
                      <span style={{ color: "#777" }}>Cargando carrito…</span>
                    </span>
                                    ) : (
                                        <>Tu carrito está vacío</>
                                    )}
                                </div>
                            ) : (
                                items.map((item) => {
                                    const nombre = item.producto?.nombre ?? `(ID: ${item.productoId ?? "?"})`;
                                    const precioUnit = Number(item.producto?.precio || 0);
                                    const qty = Number(item.cantidad || 0);
                                    const totalLinea = precioUnit * qty;
                                    const imgUrl =
                                        item.producto?.imagenUrl ||
                                        item.producto?.imageUrl ||
                                        "https://via.placeholder.com/100x70?text=IMG";

                                    return (
                                        <article className="main__cart-product-table-item" key={item.id}>
                                            <div className="main__cart-product-table-item-information">
                                                <div className="main__cart-product-table-item-product-information">
                                                    <img className="main__cart-product-table-item-image" src={imgUrl} alt={nombre} loading="lazy" />
                                                    <div className="main__cart-product-table-item-name-and-price-container">
                                                        <button
                                                            className="main__cart-product-table-item-name"
                                                            onClick={() => navigate(`/producto/${item.productoId ?? ""}`)}
                                                            title={nombre}
                                                        >
                                                            {nombre}
                                                        </button>
                                                        <small className="main__cart-product-table-item-price">₡{precioUnit.toFixed(2)}</small>
                                                    </div>
                                                </div>
                                                <span className="main__cart-product-table-item-total-price">₡{totalLinea.toFixed(2)}</span>
                                            </div>

                                            <div className="main__cart-product-tableItem-actions-container">
                                                <span className="main__cart-quantity-container">Cantidad: {qty}</span>
                                                <button
                                                    className="cart__delete"
                                                    onClick={() => eliminarItem(item.id)}
                                                    disabled={mEliminar.isPending}
                                                    title={mEliminar.isPending ? "Eliminando…" : "Eliminar"}
                                                >
                                                    <i className="fa-solid fa-trash" aria-hidden="true" />
                                                    <span>{mEliminar.isPending ? " Eliminando…" : " Eliminar"}</span>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>

                        <div className="main__cart-product-table-total-estimate-container">
                            <div className="main__cart-product-table-total-estimate-value-container">
                                <strong className="main__cart-product-table-total-estimate-value">Total estimado</strong>
                                <div className="main_cart-total-price-of-all-products-container">
                                    <span className="main_cart-total-price-of-all-products">₡{total.toFixed(2)}</span>
                                    <span> CRC</span>
                                </div>
                            </div>

                            <p className="main__cart-extr-info">Impuestos y envío están incluidos en el precio</p>

                            <div className="cart__actions">
                                <button className="main__cart-pay-button" onClick={() => navigate("/resumen")} disabled={items.length === 0}>
                                    Realizar pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        </div>
    );
}

/* ===================== ESTILOS (desktop + móvil) ===================== */
const styles = `
:root{
  --borderBottomColor: rgba(0,0,0,.12);
  --blackTransparent: rgba(0,0,0,.65);
}

.cart__outer{ padding: 40px 0 80px; }
.cart__card{ background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:16px; box-shadow:0 10px 26px rgba(0,0,0,.06); padding: clamp(18px, 2.2vw, 28px); }
.main--cart-page{ margin-top: 20px; display:flex; justify-content:center; }
.main__cart-product-table-section-container{ width:100%; padding-inline: 4vw; max-width: 1100px; }
@media (width > 1250px){ .main__cart-product-table-section-container{ width: 1200px; } }
.main__cart-title-container{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
.main__cart-title{ font-weight: 600; font-size: clamp(28px, 3vw, 38px); }
.main__cart-continue-buying-link{ font-size: clamp(13px, 1.2vw, 16px); color: var(--blackTransparent); background:none; border:0; cursor:pointer; }
.main__cart-product-table-columns-defines{ display:flex; align-items:center; justify-content:space-between; padding-bottom:18px; border-bottom:1px solid var(--borderBottomColor); }
.main__cart-product-table-column{ font-size:13px; color: rgba(0,0,0,0.45); letter-spacing:1px; }
.main__cart-product-table-items-container{ margin-top: 24px; padding-bottom: 22px; border-bottom:1px solid var(--borderBottomColor); display:flex; flex-wrap:wrap; gap:32px; }
.main__cart-empty-cart{ width:100%; display:flex; justify-content:center; align-items:center; min-height:140px; color:#555; }
.main__cart-product-table-item{ width:100%; position:relative; display:flex; flex-wrap:wrap; }
.main__cart-product-table-item-information{ width:100%; display:flex; justify-content:space-between; gap:12px; }
.main__cart-product-table-item-product-information{ display:flex; gap:14px; align-items:center; }
.main__cart-product-table-item-image{ width:100px; height:70px; object-fit:cover; border-radius:10px; border:1px solid rgba(0,0,0,.06); }
.main__cart-product-table-item-name{ color:#000; background:none; border:0; cursor:pointer; display:block; text-align:left; padding:0; font-size: clamp(16px, 1.5vw, 20px); margin-bottom: 8px; word-break: break-word; }
.main__cart-product-table-item-name:hover{ text-decoration: underline; }
.main__cart-product-table-item-price{ font-size: clamp(12px, 1.3vw, 16px); color: var(--blackTransparent); }
.main__cart-product-table-item-total-price{ font-size: clamp(14px, 1.5vw, 16px); color: var(--blackTransparent); }
.main__cart-product-tableItem-actions-container{ width:100%; display:flex; justify-content:space-between; align-items:center; margin-top:8px; gap:12px; }
.main__cart-quantity-container{ font-size: clamp(12px, 1.3vw, 16px); }
.cart__delete{ background:#fff; border:1px solid #000; color:#000; padding: 8px 12px; border-radius: 8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
.main__cart-product-table-total-estimate-container{ display:flex; flex-wrap:wrap; margin-top: 28px; gap: 18px; justify-content:center; }
.main__cart-product-table-total-estimate-value-container{ display:flex; gap: 24px; align-items:center; }
.main__cart-product-table-total-estimate-value{ font-weight: 500; font-size: clamp(15px, 1.7vw, 19px); }
.main_cart-total-price-of-all-products{ font-size: clamp(14px,1.5vw,18px); color: var(--blackTransparent); }
.main__cart-extr-info{ width:100%; text-align:center; font-size: 13px; color: rgba(0,0,0,.6); }
.cart__actions{ width:100%; display:flex; gap:18px; justify-content:center; align-items:center; margin-top: 6px; }
.main__cart-pay-button{ height:44px; width:min(80vw, 400px); background:#000; color:#fff; border:0; border-radius:10px; cursor:pointer; display:grid; place-content:center; font-size:14px; font-weight:600; }
.main__cart-pay-button:disabled{ opacity:.65; cursor:not-allowed; }
@media (max-width: 820px){
  .cart__outer{ padding: 20px 0 48px; }
  .main__cart-product-table-section-container{ padding-inline: 16px; max-width: 720px; }
  .cart__card{ padding: 16px; border-radius: 14px; }
  .main__cart-title-container{ flex-direction: column; align-items: flex-start; gap: 6px; }
  .main__cart-title{ font-size: 26px; }
  .main__cart-continue-buying-link{ font-size: 14px; }
  .main__cart-product-table-columns-defines{ display: none; }
  .main__cart-product-table-item-information{ flex-direction: column; align-items: flex-start; gap: 10px; }
  .main__cart-product-table-item-total-price{ align-self: flex-end; }
  .main__cart-product-table-item-product-information{ gap: 12px; }
  .main__cart-product-table-item-image{ width: 84px; height: 64px; }
  .main__cart-product-tableItem-actions-container{ margin-top: 10px; }
  .cart__actions{ flex-direction: column; gap: 10px; }
  .main__cart-pay-button{ width: 100%; max-width: none; }
}
@media (max-width: 480px){
  .main__cart-title{ font-size: 22px; }
  .main__cart-product-table-item-image{ width: 72px; height: 52px; }
  .main__cart-product-table-item-name{ font-size: 16px; }
  .main__cart-product-table-item-price{ font-size: 13px; }
  .main__cart-quantity-container{ font-size: 13px; }
  .cart__delete{ padding: 8px 10px; }
}
`;