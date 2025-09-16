import { useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchCarrito, apiEliminarItem } from "../services/carrito";

export default function Carrito() {
    const { user } = useUser();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data: items = [], isFetching } = useQuery({
        queryKey: ["carrito", user?.id],
        queryFn: fetchCarrito,
        enabled: !!user?.id,
        initialData: () => qc.getQueryData(["carrito", user?.id]) || [],
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        refetchOnMount: "always",
    });

    const showSpinner = isFetching && items.length === 0;

    console.log(user?.id)
    console.log(items)

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

    const eliminarItem = (itemId) => {
        mEliminar.mutate(itemId);
        console.log(itemId);
    };

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
                <section className="cart__section">
                    <div className="cart__titlebar">
                        <h1 className="cart__title">Tu carrito</h1>
                        <button
                            className="cart__link"
                            onClick={() => navigate("/productos")}
                        >
                            <u>Seguir comprando</u>
                        </button>
                    </div>
                    <div className="cart__card">
                        <div className="cart__empty">
                            Debes iniciar sesión para ver tu carrito.
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="cart__outer">
            <main className="main--cart-page">
                <section className="main__cart-product-table-section-container">
                    <div className="main__cart-title-container">
                        <h1 className="main__cart-title">Tu carrito</h1>
                        <button
                            className="main__cart-continue-buying-link"
                            onClick={() => navigate("/productos")}
                        >
                            <u>Seguir comprando</u>
                        </button>
                    </div>

                    <div className="cart__card">
                        <div className="main__cart-product-table-columns-defines">
                            <span className="main__cart-product-table-column">
                                PRODUCTO
                            </span>
                            <span className="main__cart-product-table-column">
                                TOTAL
                            </span>
                        </div>

                        <div className="main__cart-product-table-items-container">
                            {items.length === 0 ? (
                                <div className="main__cart-empty-cart">
                                    {showSpinner ? (
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <ClipLoader
                                                size={22}
                                                color="#888"
                                                speedMultiplier={0.9}
                                            />
                                            <span style={{ color: "#777" }}>
                                                Cargando carrito…
                                            </span>
                                        </span>
                                    ) : (
                                        <>Tu carrito está vacío</>
                                    )}
                                </div>
                            ) : (
                                items.map((item) => {
                                    const nombre =
                                        item.producto?.nombre ??
                                        `(ID: ${item.productoId ?? "?"})`;
                                    const precioUnit = Number(
                                        item.producto?.precio || 0
                                    );
                                    const qty = Number(item.cantidad || 0);
                                    const totalLinea = precioUnit * qty;
                                    const imgUrl =
                                        item.producto?.imagenUrl ||
                                        item.producto?.imageUrl ||
                                        "https://via.placeholder.com/100x70?text=IMG";

                                    return (
                                        <article
                                            className="main__cart-product-table-item"
                                            key={item.id}
                                        >
                                            <div className="main__cart-product-table-item-information">
                                                <div className="main__cart-product-table-item-product-information">
                                                    <img
                                                        className="main__cart-product-table-item-image"
                                                        src={imgUrl}
                                                        alt={nombre}
                                                        loading="lazy"
                                                    />
                                                    <div className="main__cart-product-table-item-name-and-price-container">
                                                        <button
                                                            className="main__cart-product-table-item-name"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/producto/${
                                                                        item.productoId ??
                                                                        ""
                                                                    }`
                                                                )
                                                            }
                                                            title={nombre}
                                                        >
                                                            {nombre}
                                                        </button>
                                                        <small className="main__cart-product-table-item-price">
                                                            ₡
                                                            {precioUnit.toFixed(
                                                                2
                                                            )}
                                                        </small>
                                                    </div>
                                                </div>
                                                <span className="main__cart-product-table-item-total-price">
                                                    ₡{totalLinea.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="main__cart-product-tableItem-actions-container">
                                                <span className="main__cart-quantity-container">
                                                    Cantidad: {qty}
                                                </span>
                                                <button
                                                    className="cart__delete"
                                                    onClick={() =>
                                                        eliminarItem(item.id)
                                                    }
                                                    disabled={
                                                        mEliminar.isPending
                                                    }
                                                    title={
                                                        mEliminar.isPending
                                                            ? "Eliminando…"
                                                            : "Eliminar"
                                                    }
                                                >
                                                    <i
                                                        className="fa-solid fa-trash"
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        {mEliminar.isPending
                                                            ? " Eliminando…"
                                                            : " Eliminar"}
                                                    </span>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>

                        <div className="main__cart-product-table-total-estimate-container">
                            <div className="main__cart-product-table-total-estimate-value-container">
                                <strong className="main__cart-product-table-total-estimate-value">
                                    Total estimado
                                </strong>
                                <div className="main_cart-total-price-of-all-products-container">
                                    <span className="main_cart-total-price-of-all-products">
                                        ₡{total.toFixed(2)}
                                    </span>
                                    <span> CRC</span>
                                </div>
                            </div>

                            <p className="main__cart-extr-info">
                                Impuestos y envío están incluidos en el precio
                            </p>

                            <div className="cart__actions">
                                <button
                                    className="main__cart-pay-button"
                                    onClick={() => navigate("/resumen")}
                                    disabled={items.length === 0}
                                >
                                    Realizar pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            />
        </div>
    );
}


