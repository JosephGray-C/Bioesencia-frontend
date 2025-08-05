// src/components/OrdenConfirmada.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrdenConfirmada() {
    const { codigo } = useParams();
    const navigate = useNavigate();

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
                <h2 style={{ color: "#5EA743", textAlign: "center" }}>¡Gracias por tu compra!</h2>
                <p style={{ textAlign: "center", marginBottom: "20px" }}>
                    Tu orden fue confirmada exitosamente. En tu correo puedes visualizar tu orden de compra: <strong>#{codigo}</strong>.
                </p>

                <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "#5EA743",
                            color: "#fff",
                            padding: "12px 24px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
