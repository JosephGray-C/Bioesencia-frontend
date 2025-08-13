// src/pages/TalleresPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TalleresPage() {
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/talleres")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los talleres");
        return res.json();
      })
      .then((data) => {
        setTalleres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error al cargar talleres:", err);
        setError("⚠️ No se pudieron cargar los talleres.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20, color: "green" }}>Cargando talleres...</p>;

  if (error)
    return (
      <div style={{
        padding: 30,
        margin: 40,
        backgroundColor: "#2c2c2c",
        color: "#ff7979",
        border: "2px solid #ff5252",
        borderRadius: 12,
        textAlign: "center",
        fontWeight: 600
      }}>
        {error}
      </div>
    );

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 30, color: "#8FDE58", textAlign: "center" }}>
        Talleres disponibles
      </h2>
      {talleres.length === 0 ? (
        <p style={{ textAlign: "center", color: "#bbb" }}>No hay talleres disponibles en este momento.</p>
      ) : (
        <ul style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24
        }}>
          {talleres.map((taller) => (
            <li key={taller.id} style={{
              border: "1px solid #444",
              borderRadius: 12,
              padding: 20,
              background: "#1e1e1e",
              color: "#f0f0f0",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{ color: "#8FDE58" }}>{taller.titulo}</h3>
              <p>{taller.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(taller.fechaInicio).toLocaleString()} - {new Date(taller.fechaFin).toLocaleString()}</p>
              <p><strong>Lugar:</strong> {taller.lugar}</p>
              <p><strong>Precio:</strong> {taller.precio.toLocaleString("es-CR", { style: "currency", currency: "CRC" })}</p>
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
                  fontWeight: "bold"
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
