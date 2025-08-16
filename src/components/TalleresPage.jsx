// src/pages/TalleresPage.jsx
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/api/talleres";

async function fetchTalleres({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error("Error al cargar los talleres");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export default function TalleresPage() {
    const qc = useQueryClient();

    const {
        data: talleres = [],
        isFetching,
        error,
    } = useQuery({
        queryKey: ["talleres"],
        queryFn: fetchTalleres,
        initialData: () => qc.getQueryData(["talleres"]) || [],
    });

    const showSpinner = isFetching && talleres.length === 0;

    if (error) {
        return (
            <div
                style={{
                    padding: 30,
                    margin: 40,
                    backgroundColor: "#2c2c2c",
                    color: "#ff7979",
                    border: "2px solid #ff5252",
                    borderRadius: 12,
                    textAlign: "center",
                    fontWeight: 600,
                }}
            >
                ⚠️ No se pudieron cargar los talleres.
            </div>
        );
    }

    return (
        <div style={{ padding: 40 }}>
            <h2 style={{ marginBottom: 30, color: "#8FDE58", textAlign: "center" }}>
                Talleres disponibles
            </h2>

            {talleres.length === 0 ? (
                <div
                    style={{
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {showSpinner ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                            <ClipLoader size={24} color="#bbb" speedMultiplier={0.9} />
                            <span style={{ color: "#bbb" }}>Cargando talleres…</span>
                        </span>
                    ) : (
                        <p style={{ textAlign: "center", color: "#bbb" }}>
                            No hay talleres disponibles en este momento.
                        </p>
                    )}
                </div>
            ) : (
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 24,
                    }}
                >
                    {talleres.map((taller) => (
                        <li
                            key={taller.id}
                            style={{
                                border: "1px solid #444",
                                borderRadius: 12,
                                padding: 20,
                                background: "#1e1e1e",
                                color: "#f0f0f0",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            }}
                        >
                            <h3 style={{ color: "#8FDE58" }}>{taller.titulo}</h3>
                            <p>{taller.descripcion}</p>
                            <p>
                                <strong>Fecha:</strong>{" "}
                                {taller.fechaInicio ? new Date(taller.fechaInicio).toLocaleString() : "—"}{" "}
                                -{" "}
                                {taller.fechaFin ? new Date(taller.fechaFin).toLocaleString() : "—"}
                            </p>
                            <p>
                                <strong>Lugar:</strong> {taller.lugar}
                            </p>
                            <p>
                                <strong>Precio:</strong>{" "}
                                {Number(taller.precio || 0).toLocaleString("es-CR", {
                                    style: "currency",
                                    currency: "CRC",
                                })}
                            </p>
                            <Link
                                to={`/talleres/${taller.id}`}
                                style={{
                                    display: "inline-block",
                                    marginTop: 12,
                                    padding: "8px 16px",
                                    backgroundColor: "#8FDE58",
                                    color: "#1c1c1c",
                                    textDecoration: "none",
                                    borderRadius: 8,
                                    fontWeight: "bold",
                                }}
                            >
                                Ver más
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}