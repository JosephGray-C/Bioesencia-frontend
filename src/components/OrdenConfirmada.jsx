// src/components/OrdenConfirmada.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

const API_ORDENES_PDF = "http://localhost:8080/api/ordenes/pdf";

export default function OrdenConfirmada() {
    const { codigo } = useParams();
    const { user } = useUser();
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const res = await fetch(`${API_ORDENES_PDF}/${codigo}`);
                if (!res.ok) throw new Error("No se pudo cargar el PDF");

                const blob = await res.blob();
                const pdfBlobUrl = URL.createObjectURL(blob);
                setPdfUrl(pdfBlobUrl);
            } catch (err) {
                console.error("Error al obtener PDF:", err);
            }
        };

        if (codigo) fetchPdf();
    }, [codigo]);

    return (
        <div style={{ background: "#f2f2f2", minHeight: "100vh", padding: "60px 20px" }}>
            <div style={{
                background: "#fff",
                maxWidth: "900px",
                margin: "0 auto",
                padding: "40px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                borderRadius: 12,
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: 30, color: "#5EA743" }}>
                    ¡Gracias por tu compra, {user?.nombre}!
                </h2>
                <p>Tu orden fue confirmada exitosamente. Aquí puedes visualizar el comprobante oficial:</p>

                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title="Orden PDF"
                        width="100%"
                        height="600px"
                        style={{ marginTop: 30, border: "1px solid #ccc" }}
                    />
                ) : (
                    <p style={{ marginTop: 40 }}>Cargando comprobante...</p>
                )}
            </div>
        </div>
    );
}
