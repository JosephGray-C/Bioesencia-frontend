import React from "react";

export default function Producto({ prod, setModalProd }) {
    return (
            <article
                className="bu-card producto-card"
                key={prod.id}
                onClick={() => setModalProd(prod)}
                tabIndex={0}
            >
                {/* Imagen */}
                {prod.imagenUrl ? (
                    <div className="bu-card-media">
                        <img
                            src={prod.imagenUrl}
                            alt={prod.nombre}
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentNode.classList.add(
                                    "bu-card-media--placeholder"
                                );
                                e.target.parentNode.innerHTML =
                                    "<span>Producto</span>";
                            }}
                        />
                    </div>
                ) : (
                    <div className="bu-card-media bu-card-media--placeholder">
                        <span>Producto</span>
                    </div>
                )}
                {/* Contenido */}
                <div className="bu-card-body">
                    <h3 className="bu-card-title">{prod.nombre}</h3>
                    <p className="bu-card-excerpt">{prod.descripcion}</p>
                </div>
                {/* Footer */}
                <div className="bu-card-footer bu-card-footer--product">
                    <span className="bu-card-price">
                        {Number(prod.precio || 0).toLocaleString("es-CR", {
                            style: "currency",
                            currency: "CRC",
                            minimumFractionDigits: 2,
                        })}
                    </span>
                </div>
            </article>
    );
}
